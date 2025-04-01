var FolderUploadWidgetControl = createClass({
  getInitialState: function() {
    return {
      uploading: false,
      error: null,
      uploadedImages: [] // each item: { url: string, previewUrl: string }
    };
  },

  handleFolderChange: function(e) {
    var files = Array.prototype.slice.call(e.target.files);
    // Filter for image files only.
    var imageFiles = files.filter(function(file) {
      return file.type.indexOf("image") === 0;
    });
    if (imageFiles.length === 0) return;

    this.setState({ uploading: true, error: null });
    var backend = CMS.getBackend();

    // If uploadFile exists, use it; otherwise simulate an upload.
    var uploadFileFunction = backend && typeof backend.uploadFile === "function"
      ? backend.uploadFile.bind(backend)
      : function(file, options) {
          return new Promise(function(resolve) {
            setTimeout(function() {
              var fakeUrl = options.path;
              var blobUrl = URL.createObjectURL(file);
              resolve({ url: fakeUrl, blobUrl: blobUrl });
            }, 300);
          });
        };

    // Extract folder name from the first file’s relative path.
    var relativePath = imageFiles[0].webkitRelativePath || "";
    var folderName = relativePath.split("/")[0] || "default-folder";

    // Get config with fallback.
    var config = this.props.config || CMS.getConfig();
    var mediaFolder = (config.get ? config.get("media_folder") : config.media_folder) || "src/assets/images/cms";
    var publicFolder = (config.get ? config.get("public_folder") : config.public_folder) || "/assets/images/cms";

    // Destination folder (e.g., "src/assets/images/cms/MyFolder").
    var destFolder = mediaFolder + "/" + folderName;

    // Create upload promises for each image file.
    var uploadPromises = imageFiles.map(function(file) {
      var destPath = destFolder + "/" + file.name;
      return uploadFileFunction(file, { path: destPath, public_folder: publicFolder });
    });

    Promise.all(uploadPromises)
      .then(function(uploadedFiles) {
        // Map each uploaded file to an object with URL and previewUrl.
        var newUploadedImages = uploadedFiles.map(function(uploadData, idx) {
          return {
            url: uploadData.url || (destFolder + "/" + imageFiles[idx].name),
            previewUrl: uploadData.blobUrl || (destFolder + "/" + imageFiles[idx].name)
          };
        });
        // Update widget value (array of URLs) and state (for preview).
        var urls = newUploadedImages.map(function(item) { return item.url; });
        this.props.onChange(urls);
        this.setState({ uploadedImages: newUploadedImages, uploading: false });
      }.bind(this))
      .catch(function(err) {
        console.error("Upload failed:", err);
        this.setState({ uploading: false, error: "Upload failed. Check the console for details." });
      }.bind(this));
  },

  removeImage: function(index) {
    var uploadedImages = this.state.uploadedImages.slice();
    uploadedImages.splice(index, 1);
    this.setState({ uploadedImages: uploadedImages });
    var urls = uploadedImages.map(function(item) { return item.url; });
    this.props.onChange(urls);
  },

  render: function() {
    var uploadedImages = this.state.uploadedImages;
    return h("div", { className: "folder-upload-widget-control", style: { padding: "10px" } },
      h("input", {
        type: "file",
        webkitdirectory: "true",
        directory: "true",
        multiple: true,
        onChange: this.handleFolderChange
      }),
      this.state.uploading && h("div", { style: { marginTop: "10px" } }, "Uploading images..."),
      this.state.error && h("div", { style: { color: "red", marginTop: "10px" } }, this.state.error),
      uploadedImages.length > 0 && h("div", { style: { marginTop: "10px" } },
        uploadedImages.map(function(item, index) {
          return h("div", {
              key: index,
              style: { display: "inline-block", position: "relative", margin: "5px" }
            },
            // Use blob URL for preview if available.
            h("img", {
              src: item.previewUrl,
              alt: "Uploaded image " + (index + 1),
              style: { maxWidth: "200px", display: "block" }
            }),
            h("button", {
              onClick: function() { this.removeImage(index); }.bind(this),
              style: {
                position: "absolute",
                top: "0",
                right: "0",
                background: "rgba(255, 0, 0, 0.8)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer"
              }
            }, "X")
          );
        }, this)
      )
    );
  }
});

var FolderUploadWidgetPreview = createClass({
  render: function() {
    var urls = this.props.value || [];
    return h("div", { className: "folder-upload-widget-preview" },
      urls.length === 0
        ? "No images uploaded."
        : urls.map(function(url, index) {
            return h("img", {
              key: index,
              src: url,
              alt: "Uploaded image " + (index + 1),
              style: { maxWidth: "200px", margin: "5px" }
            });
          })
    );
  }
});

CMS.registerWidget("folder-upload", FolderUploadWidgetControl, FolderUploadWidgetPreview);
