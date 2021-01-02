function resetDefaultURLs(){
    console.log("Click");
    document.getElementById("github_url_1").value = "https://github.com";
    document.getElementById("github_url_2").value = "";
}

document.getElementById("restore_default_urls").addEventListener("click", resetDefaultURLs);
