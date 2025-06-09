const form = document.getElementById("planning-form");
const result = document.getElementById("planning-result");
const tripName = document.getElementById("tripName");
const tripStart = document.getElementById("tripStart");
const tripEnd = document.getElementById("tripEnd");
const dateStart = document.getElementById("dateStart");
const dateEnd = document.getElementById("dateEnd");
const transportMethod = document.getElementById("transportMethod");
const radioStay = document.getElementsByName("radioStay");
const additionalInfo = document.getElementById("additionalInfo");
const displaybtn = document.getElementById("btn-display");
let planningSwiper = null;
let editIndex = null;

display();

let date = new Date();
let today = date.getDate();

today = today < 10 ? (today = "0" + today) : today;
let month = date.getMonth() + 1;
month = month < 10 ? (month = "0" + month) : month;
let year = date.getFullYear();

let currentDate = `${year}-${month}-${today}`;
dateStart.min = currentDate;

dateStart.addEventListener("change", () => {
  dateEnd.min = dateStart.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let radioValue;
  for (let i = 0; i < radioStay.length; i++) {
    if (radioStay[i].checked) {
      radioValue = radioStay[i].value;
      break;
    }
  }

  let trip = {
    nazwa: tripName.value,
    poczatkowe: tripStart.value,
    docelowe: tripEnd.value,
    start: dateStart.value,
    end: dateEnd.value,
    transport: transportMethod.value,
    info: additionalInfo.value,
    nocleg: radioValue,
  };

  let trips = JSON.parse(localStorage.getItem("trips")) || [];

  if (editIndex !== null) {
    trips[editIndex] = trip;
    editIndex = null;
  } else {
    trips.push(trip);
  }

  localStorage.setItem("trips", JSON.stringify(trips));

  form.reset();

  display();
});

function display() {
  let trips = JSON.parse(localStorage.getItem("trips")) || [];

  let out = "";
  if (!trips || trips.length === 0) {
    result.innerHTML = "<p>Zacznij planować</p>";
  } else {
    const useSwiper = trips.length > 3;

    for (let i = 0; i < trips.length; i++) {
      // prettier-ignore
      out += `
        <div class="${useSwiper ? "swiper-slide" : "swiper-slide-off"}">
          <div class='planned-trips'>
            <div class="trip-header">
              <p class="trip-title">${trips[i].nazwa}</p>
              <p><button type="button" class="btn-trip" onclick="deleteTrip(${i})"><i class="fa-solid fa-trash"></i></button><button class="btn-trip" onclick="editTrip(${i})"><i class="fa-solid fa-pen-to-square"></i></button></p>
            </div>
            <div class="trip-content">
              <p class="trip-places"><span><strong>Trasa:</strong></span><span> ${trips[i].poczatkowe}&nbsp;<i class="fa-solid fa-plane">&nbsp;</i>${trips[i].docelowe}</span></p> 
              <p class="trip-time"><strong>Data:</strong> ${
                trips[i].start
              }<i class="fa-solid fa-calendar-check"></i>${trips[i].end}</p>
              <p><strong>Transport:</strong> ${trips[i].transport}</p>
              <p><strong>Nocleg:</strong> ${trips[i].nocleg}</p>
              <p><strong>Info:</strong><br> ${trips[i].info}</p>
            </div>
          </div>
        </div>
      `;
    }
    result.innerHTML = out;

    if (trips.length > 3) {
      document.getElementById("swiper-2").classList.remove("swiper-off");
      if (!planningSwiper) {
        planningSwiper = new Swiper("#swiper-2", {
          loop: false,
          slidesPerView: 3.1,
          spaceBetween: 10,
          centeredSlides: false,
          breakpoints: {
            200: {
              slidesPerView: 1,
            },
            950: {
              slidesPerView: 2,
            },
            1600: {
              slidesPerView: 3,
            },
          },
        });
      } else {
        planningSwiper.update();
      }
    } else {
      document.getElementById("swiper-2").classList.add("swiper-off");
      if (planningSwiper) {
        planningSwiper.destroy(true, true);
        planningSwiper = null;
      }
    }
  }
}

function deleteTrip(i) {
  let trips = JSON.parse(localStorage.getItem("trips"));
  if (confirm("Rezygnujesz z podróży?")) {
    trips.splice(i, 1);
  }
  localStorage.setItem("trips", JSON.stringify(trips));
  display();
}

function editTrip(i) {
  let trips = JSON.parse(localStorage.getItem("trips"));
  let trip = trips[i];

  tripName.value = trip.nazwa;
  tripStart.value = trip.poczatkowe;
  tripEnd.value = trip.docelowe;
  dateStart.value = trip.start;
  dateEnd.value = trip.end;
  transportMethod.value = trip.transport;
  additionalInfo.value = trip.info;
  for (let i = 0; i < radioStay.length; i++) {
    if (radioStay[i].value === trip.nocleg) {
      radioStay[i].checked = true;
      break;
    }
  }

  editIndex = i;
}

function tripCancel() {
  editIndex = null;
}

new Swiper("#swiper", {
  loop: true,
  centeredSlides: true,
  slidesPerView: 1.8,
  spaceBetween: 20,
  grabCursor: true,
  lazy: {
    loadPrevNext: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  effect: "coverflow",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 34,
    modifier: 2,
    slideShadows: true,
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    waitForTransition: false,
  },
  speed: 1200,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    200: {
      slidesPerView: 1,
    },
    1200: {
      slidesPerView: 1.5,
    },
  },
});

fetch("./Destinations/destinations.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Błąd: " + res.status);
    }
    return res.json();
  })
  .then((data) => {
    const swiperWrapper = document.getElementById("trivia-result");
    data.destinations.forEach((dest) => {
      let attractions = "";
      dest.attractions.forEach((attr) => {
        attractions += `<li><strong>${attr.name}</strong>: ${attr.description}</li>`;
      });

      let out = '<div class="swiper-slide">';
      out += `
        <div class="trivia-slide-content">
          <h2>${dest.city}, ${dest.country}</h2>
          <p class="fact">"${dest.fact}"</p>
          <h3>Co warto odwiedzić:</h3>
          <ul class="attractions-list">
            ${attractions}
          </ul>
        </div>
      `;
      swiperWrapper.innerHTML += out;
    });

    new Swiper("#swiper-3", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
        waitForTransition: false,
      },
      speed: 1500,
      allowTouchMove: false,
    });
  })
  .catch((error) => {
    console.error("Błąd podczas fetch:", error);
  });
