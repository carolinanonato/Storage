document.addEventListener("DOMContentLoaded", function () {
    console.log("loaded");
  
    const fileUpload = document.getElementById("fileUpload");
    const imgName = document.getElementById("imgName");
    const submitBtn = document.getElementById("submitBtn");

    const db = firebase.firestore()
    const storage = firebase.storage()
  
    let file = "";
    let fileName = "";
    let extension = "";
  
    fileUpload.addEventListener("change", function (e) {
      console.log("e", e);
        file = e.target.files[0]    
        fileName = file.name.split(".").shift();
        extension = file.name.split(".").pop();

        imgName.value = fileName
      
    });

    submitBtn.addEventListener('click', function () {
        if (imgName.value ) {
            const id = db.collection("Images").doc().id;
            const storageRef = storage.ref(`images/${id}.${extension}`)

            const uploadTask = storageRef.put(file)

            uploadTask.on("state_changed", function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.value = progress;
            }, function (error) {
                vonsole.log('Error:', error)
            },
            function () {
                console.log('Uploaded!')
            })
        }
    })


  });