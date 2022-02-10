document.addEventListener("DOMContentLoaded", function () {
    console.log("loaded");
  
    const fileUpload = document.getElementById("fileUpload");
    const imgName = document.getElementById("imgName");
    const submitBtn = document.getElementById("submitBtn");
    const gallery = document.getElementById("gallery");
    
  
    const db = firebase.firestore();
    const storage = firebase.storage();
  
    let file = "";
    let fileName = "";
    let extension = "";
  
    fileUpload.addEventListener("change", function (e) {
      file = e.target.files[0];
      fileName = file.name.split(".").shift();
      extension = file.name.split(".").pop();
  
      imgName.value = fileName;
    });
  
    submitBtn.addEventListener("click", function () {
      if (imgName.value) {
        const id = db.collection("Images").doc().id;
  
        const storageRef = storage.ref(`images/${id}.${extension}`);
  
        const uploadTask = storageRef.put(file);
  
        uploadTask.on(
          "state_changed",
          function (snapshot) {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = progress;
          },
          function (error) {
            console.log("Error:", error);
          },
          function () {
            uploadTask.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
                db.collection("images")
                .doc(id)
                .set({
                    name: imgName.value,
                    id: id,
                    image: downloadURL,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    console.log("Document written");
                    file = "";
                    fimeName = "";
                    extension = "";
                    imgName.value = "";
                    uploader.value = 0;
                    createGallery()
                  })
                  .catch((err) => console.log("Error adding the document", err));
            })
          }
        );
        
      }
    
    });
   

    function createGallery () {
        gallery.innerHTML=""
      
        const listRef = storage.ref("images")
        listRef.listAll().then(function (res) {
          res.items.forEach (function (itemRef) {
            itemRef.getDownloadURL()
            .then((downloadURL) => {
             const imgWrapper = document.createElement('div')
             imgWrapper.className="img_wrapper"

             const img = document.createElement('img')
             img.src= downloadURL

             const deleteBtn = document.createElement('span')
             deleteBtn.innerHTML = "x";
             deleteBtn.className="img_delete"
             
            
             deleteBtn.addEventListener("click", function () {
                itemRef
                  .delete()
                  .then(function () {
                    db.collection("Images")
                      .doc(itemRef.name.split(".").shift())
                      .delete()
                      .then(function () {
                        console.log("Document deleted successfully!");
                        createGallery();
                      })
                      .catch((err) =>
                        console.log("Error deleting the document", err)
                      );
                  })
                  .catch((err) => console.log("Error deleting the image", err));
              });
    
              imgWrapper.append(img);
              imgWrapper.append(deleteBtn);
              gallery.append(imgWrapper);
            });
          });
        });
      }
    
      createGallery();
    });