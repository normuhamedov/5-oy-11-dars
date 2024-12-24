const apiUrl = "http://localhost:3000/users";
let editingId = null;

document.getElementById("addUser").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const study = document.getElementById("study").value.trim();
    
    if (name && age && study) {
        if (editingId) {
            await axios.put(`${apiUrl}/${editingId}`, { id: editingId, name, age: parseInt(age), study });
            editingId = null;
            document.getElementById("addUser").textContent = "Add User";
        } else {
            await axios.post(apiUrl, { name, age: parseInt(age), study });
        }
        
        resetForm();
        loadUsers();
    }
});

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("study").value = "";
}

async function loadUsers() {
    const res = await axios.get(apiUrl);
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    
    let counter = 1;
    
    res.data.forEach(user => {
        const userCard = document.createElement("li");
        userCard.className = "bg-white p-4 shadow rounded-[30px] flex justify-between items-center mt-5";
        
        userCard.setAttribute("data-custom-id", counter);
        userCard.innerHTML = `
        <div>
          <p><strong>ID:</strong> ${counter}</p>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Age:</strong> ${user.age}</p>
          <p><strong>Study:</strong> ${user.study}</p>
        </div>
        <div>
          <button class="edit bg-blue-500 text-white py-1 px-2 rounded-[30px] mr-2" data-id="${user.id}">Edit</button>
          <button class="delete bg-red-500 text-white py-1 px-2 rounded-[30px]" data-id="${user.id}">Delete</button>
        </div>
      `;
        
        userList.appendChild(userCard);
        counter++;
    });
    
    addEventListeners();
}


// delete ,edit
function addEventListeners() {
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            await axios.delete(`${apiUrl}/${id}`);
            loadUsers();
        });
    });
    
    
    
    document.querySelectorAll(".edit").forEach(button => {
        button.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            const user = (await axios.get(`${apiUrl}/${id}`)).data;
            document.getElementById("name").value = user.name;
            document.getElementById("age").value = user.age;
            document.getElementById("study").value = user.study;
            editingId = user.id;
            document.getElementById("addUser").textContent = "Update User";
        });
    });
}

loadUsers();
