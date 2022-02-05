

/*                          FETCHING DATA                          
-                                                                                      */
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var languageButtonsEl = document.querySelector("#language-buttons");
languageButtonsEl.id = 'language-buttons';
console.log(languageButtonsEl);

var formSubmitHandler = function(event) {
  event.preventDefault();
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert("Please enter a GitHub username");
  }
};

var getUserRepos = function(user) {                                      // format the github api url

  var apiUrl = "https://api.github.com/users/" + user + "/repos";
  fetch(apiUrl)
    .then(function(response) {

      if (response.ok) {
        response.json().then(function(data) {
        displayRepos(data, user);
      });
      } 
      else {
        alert('Error: GitHub User Not Found');
      }
    })
    .catch(function(error) {
      console.log(error);
      alert("Unable to connect to GitHub");
    });
};

var displayRepos = function(repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {        

    var repoName = repos[i].owner.login + "/" + repos[i].name;   // format repo name
 
  
    var repoEl = document.createElement("a");                // create a container for each repo
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    var titleEl = document.createElement("span");               // create a span element to hold repository name
    titleEl.textContent = repoName;
    repoEl.appendChild(titleEl);                            // append to container
  
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    if (repos[i].open_issues_count > 0) {                      // check if current repo has issues or not
      statusEl.innerHTML =
      "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } 
    else {
    statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    } 

    repoEl.appendChild(statusEl);                        // append to container 
    repoContainerEl.appendChild(repoEl);                 // append container to the dom
  }
};

var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
      });
    }
    else {
      alert ('Error: GitHub User Not Found');
    }
  });
}


var buttonClickHandler = function(event) {
  var language = event.target.getAttribute("data-language");
  if (language) {
    getFeaturedRepos(language);
    // clear old content
    repoContainerEl.textContent = "";
  }
  console.log(language);
}

/*                    EVENT LISTENERS FOR FORM                 */

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);










