let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];

        document.getElementById("fileInput").addEventListener("change", function(event) {
            handleFileUpload(event.target.files[0]);
        });

        function handleFileUpload(file) {
            if (!file) return;

            let reader = new FileReader();
            reader.onload = function(e) {
                let fileData = {
                    id: generateID(),
                    name: file.name,
                    type: file.type,
                    content: e.target.result
                };

                uploadedFiles.push(fileData);
                localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));

                document.getElementById("result").innerHTML = `
                    <p>success upload url 🌟</p>
                    <a class="json-link" href="?bagus=${fileData.id}" target="_blank">🔗 Lihat File</a>
                `;
            };

            if (file.type.startsWith("image/")) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        }

        function uploadFile() {
            let fileInput = document.getElementById("fileInput");
            if (fileInput.files.length > 0) {
                handleFileUpload(fileInput.files[0]);
            } else {
                alert("Pilih file dulu lah bang");
            }
        }

        function generateID() {
            return Math.random().toString(36).substr(2, 10);
        }

        function clearAll() {
            localStorage.removeItem("uploadedFiles");
            uploadedFiles = [];
            alert("Semua file dihapus!");
            document.getElementById("result").innerHTML = "Hasil akan muncul di sini...";
        }

        function checkURLForFile() {
            let urlParams = new URLSearchParams(window.location.search);
            let fileID = urlParams.get("kenzcdn");

            if (fileID) {
                let file = uploadedFiles.find(f => f.id === fileID);
                if (file) {
                    if (file.type.startsWith("image/")) {
                        document.body.innerHTML = `<img src="${file.content}" alt="${file.name}" class="uploaded-image">`;
                    } else {
                        document.body.innerHTML = `<pre>${file.content}</pre>`;
                    }
                } else {
                    document.body.innerHTML = `<p>⚠️ File tidak ditemukan</p>`;
                }
            }
        }

        checkURLForFile();
