const leaderboard = document.querySelector("[data-leaderboard]")
const sor = document.querySelector("[data-row]")

fetch("/Adat/Leaderboard")
    .then(response => response.json())
    .then(data => {
        let counter = 0
        data.forEach(user => {
            let newRow = sor.cloneNode(true)
            newRow.classList.toggle("hide")
            let rank = newRow.children[0]
            let name = newRow.children[1]
            let score = newRow.children[2]

            rank.textContent = counter += 1
            rank.textContent += "."
            name.textContent = user.username
            score.textContent = user.highscore_value

            leaderboard.append(newRow)
        });
    })