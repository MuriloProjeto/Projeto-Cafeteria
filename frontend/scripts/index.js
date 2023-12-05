const headers = new Headers();
fetch("http://localhost:3000/produtos/1", {
    method: "GET",
    headers: headers
}).then((res) => res.json())
.then((data) => console.log(data))