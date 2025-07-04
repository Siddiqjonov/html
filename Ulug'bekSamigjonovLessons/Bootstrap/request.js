fetch('https://localhost:7095/api/MyInfo')
    .then(response => response.json())
    .then(data => {
        document.getElementById("output").innerHTML = `
            <div class="info-card">
                <p>ID: ${data.id}</p><hr>
                <p>First Name: ${data.FirstName}</p><hr>
                <p>Last Name: ${data.LastName}</p><hr>
                <p>Full Name: ${data.FullName}</p><hr>
                <p>Username: ${data.UserName}</p><hr>
                <p>Bithday: ${data.Birthday}</p><hr>
                <p>Birthday: ${new Date(data.Birthday).toLocaleDateString()}</p><hr>
                <p>Age: ${data.age}</p>
            </div>
                <div class="info-card">
                <p><span>ID:</span> <span id="s">${data.Id}</span></p><hr>
                <p><span>First Name:</span> ${data.FirstName}</p><hr>
                <p><span>Last Name:</span> ${data.LastName}</p><hr>
                <p><span>Full Name:</span> ${data.FullName}</p><hr>
                <p><span>Username:</span> ${data.UserName}</p><hr>
                <p><span>Birthday:</span> ${new Date(data.Birthday).toLocaleDateString()}</p><hr>
                <p><span>Age:</span> ${data.age}</p>
            </div>
        `;
    })
    .catch(error => {
        document.getElementById("output").textContent = "Error: " + error;
    });
