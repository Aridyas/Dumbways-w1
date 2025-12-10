const form = document.getElementById("originalForm");
const title = document.getElementById("title");
const personName = document.getElementById("personName");
const value = document.getElementById("value");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData(form);

        const data = {
            title: formData.get("title"),
            name: formData.get("personName"),
            value: formData.get("value")
        };

        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        document.getElementById("messageOutput").innerText = json.message;
        document.getElementById("titleOutput").innerText = json.title;
        document.getElementById("nameOutput").innerText = json.name;
        document.getElementById("valueOutput").innerText = json.value;

    } catch (err) {
        console.error(err)
    }

})
