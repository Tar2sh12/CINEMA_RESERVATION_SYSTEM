const container = document.querySelector('.container');
const seats = document.querySelectorAll('.seat .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

let ticketPrice = +movieSelect.value; //add a plus sign to turn string into a number

//save selected movie index, price.
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

// update to seatcount and total
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat)); //spread operator(3 dots) copies everything in selectedSeats then turn into array.

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
    
    const selectedSeatsCount = selectedSeats.length; //gets length of nodelist

    count.innerText = selectedSeatsCount; //change the text inside the count span
    total.innerText = '£' + selectedSeatsCount * ticketPrice; //multiply the ticket price by the number of seats booked. 
    
}
//copy selected seats into arr^^^
//map through arr
//return a new arr of indexes


//MOVIE SELECT EVENT
movieSelect.addEventListener('change', (e) => {
    ticketPrice = +e.target.value; //change value of target according to price
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});


//SEAT CLICK EVENT - change colour of seat when selected
container.addEventListener('click', (e) => {
    if(e.target.classList.contains('seat') //to check if the class list contains the class of seat, then click
    && !e.target.classList.contains('occupied')) //if it has the class of seat, but not occupied then click.
     {
        e.target.classList.toggle('selected'); //toggles the colour of the selcted seat

        updateSelectedCount();
    }
});

