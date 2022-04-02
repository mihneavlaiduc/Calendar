import { set } from "../storage-utils.js"
import { get } from "../storage-utils.js"
document.addEventListener("DOMContentLoaded", function () {

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const date = new Date();
    let year = date.getFullYear();
    let i = date.getMonth();
    var currentDay = date.getDate();

    const currentMonth = document.getElementById("calendar-current-month");
    currentMonth.textContent = months[date.getMonth()] + " " + date.getFullYear();


    var monthDays = daysInMonth(year, i + 1);
    const firstDayOfTheMonth = getFirstDayOfMonth(year, i);



    const saveEvent = (event) => {
        event.preventDefault();
        const eventData = [...event.target]
            .filter(element => {
                return element.nodeName !== 'BUTTON'
            })
            .reduce((acc, element) => {

                return { ...acc, [element.name]: element.value };
            }, {});
        set("event", eventData);

        const mainEvents = document.getElementById("main");
        const section = document.createElement("section");
        mainEvents.append(section);

        for (let i = 0; i < 3; i++) {
            const div = document.createElement("div");
            div.textContent = Object.values(eventData)[i];
            div.textContent = div.textContent.toUpperCase();
            section.append(div);
        }

    }
    function pushEvent() {
        const addEventModalRoot = document.getElementById("add-event-button-modal");
        const form = addEventModalRoot.querySelector("form");
        form.addEventListener("submit", saveEvent, false);
    }
    const saveCategory = (event) => {
        event.preventDefault();
        const categoryData = [...event.target]
            .filter(element => {
                return element.nodeName !== 'BUTTON'
            })
            .reduce((acc, element) => {

                return { ...acc, [element.name]: element.value };
            }, {});

        set("category", categoryData);

        const mainCategories = document.getElementById("categories-list");
        const div = document.createElement("div");
        div.textContent = Object.values(categoryData)[0];
        const i = document.createElement("i");
        i.setAttribute("class", "box");
        i.setAttribute("id", "box-" + Object.values(categoryData)[1]);
        div.appendChild(i);
        mainCategories.appendChild(div);
    }
    function pushCategory() {
        const addEventModalRoot = document.getElementById("add-category-button-modal");
        const form = addEventModalRoot.querySelector("form");
        form.addEventListener("submit", saveCategory, false);
    }

    createCalendar();
    nextMonthButtonEvent();
    previousMonthButtonEvent();
    attachDayClickEvent();
    previousDayButtonEvent();
    nextDayButtonEvent();
    createAddEventButtonModal();
    createAddCategoryModal();
    pushEvent();
    pushCategory();

    function createAddCategoryModal() {
        var addCategoryButtonModal = document.getElementById("add-category-button-modal");
        var addCategoryButton = document.getElementById("add-category-button");
        var span = document.getElementsByClassName("closeAddCategoryModal")[0];
        addCategoryButton.onclick = function () {
            addCategoryButtonModal.style.display = "block";
        }
        span.onclick = function () {
            addCategoryButtonModal.style.display = "none";
        }
    }
    function createAddEventButtonModal() {
        var addEventButtonModal = document.getElementById("add-event-button-modal");
        var addEventButton = document.getElementById("add-event-button");
        var span = document.getElementsByClassName("closeAddEventModal")[0];
        addEventButton.onclick = function () {
            addEventButtonModal.style.display = "block";
        }
        span.onclick = function () {
            addEventButtonModal.style.display = "none";
        }
    }
    function attachDayClickEvent() {
        document.getElementById("calendar-wrapper").getElementsByTagName("section")[0].childNodes.forEach((e) => {
            e.addEventListener("click", (day) => {
                console.log(day.target.id);
                //day.target.style.color = "red";
            })
        })
    }
    function swtichToPreviousMonth() {
        const shownMonth = document.getElementById("calendar-current-month");
        i -= 1;
        if (i == -1) {
            year -= 1;
            i = 11;
        }
        shownMonth.textContent = months[i % 12] + " " + year;

        const startingDay = getFirstDayOfMonth(year, i);
        const finalDay = daysInMonth(year, i + 1);
        monthDays = daysInMonth(year, i + 1);

        const calendar = document.getElementById("calendar-wrapper").getElementsByTagName("div");

        var emptyDivCounter = 1;

        for (let i = 8; i < 8 + startingDay - 1; i++) {
            calendar[i].textContent = " ";
            calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter);
            emptyDivCounter += 1;
        }

        var dayCounter = 1;

        for (let i = 8 + startingDay - 1; i < 8 + startingDay + finalDay - 1; i++) {
            calendar[i].textContent = dayCounter;
            calendar[i].setAttribute("id", "day" + dayCounter);
            dayCounter += 1;
        }

        for (let i = 8 + startingDay + finalDay - 1; i < (8 + startingDay + finalDay - 1) + 7; i++) {
            calendar[i].textContent = " ";
            calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter);
            emptyDivCounter += 1;
        }
    }
    function switchToNextMonth() {
        const shownMonth = document.getElementById("calendar-current-month");
        i += 1;
        if (i % 12 == 0) {
            i = 0;
            year += 1;
        }
        shownMonth.textContent = months[i % 12] + " " + year;
        const startingDay = getFirstDayOfMonth(year, i);
        const finalDay = daysInMonth(year, i + 1);
        monthDays = daysInMonth(year, i + 1);


        const calendar = document.getElementById("calendar-wrapper").getElementsByTagName("div");

        var emptyDivCounter = 1;

        for (let i = 8; i < 8 + startingDay - 1; i++) {
            calendar[i].textContent = " ";
            calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter)
            emptyDivCounter += 1;
        }

        var dayCounter = 1;

        for (let i = 8 + startingDay - 1; i < 8 + startingDay + finalDay - 1; i++) {
            calendar[i].textContent = dayCounter;
            calendar[i].setAttribute("id", "day" + dayCounter)
            dayCounter += 1;
        }

        for (let i = 8 + startingDay + finalDay - 1; i < (8 + startingDay + finalDay - 1) + 7; i++) {
            calendar[i].textContent = " ";
            calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter);
            emptyDivCounter += 1;
        }
    }
    function nextDayButtonEvent() {
        document.getElementById("calendar-next-day").addEventListener("click", (e) => {

            if (monthDays == 31 && currentDay == 31) {
                document.getElementById("day" + currentDay).style.color = "black";
                currentDay = 1;
                switchToNextMonth();
                document.getElementById("day" + currentDay).style.color = "red";
            }
            else {
                if (monthDays == 30 && currentDay == 30) {
                    document.getElementById("day" + currentDay).style.color = "black";
                    switchToNextMonth();
                    currentDay = 1;
                    document.getElementById("day" + currentDay).style.color = "red";
                }
                else {
                    if (monthDays == 29 && currentDay == 29) {
                        document.getElementById("day" + currentDay).style.color = "black";
                        switchToNextMonth();
                        currentDay = 1;
                        document.getElementById("day" + currentDay).style.color = "red";
                    }
                    else {
                        if (monthDays == 28 && currentDay == 28) {
                            document.getElementById("day" + currentDay).style.color = "black";
                            switchToNextMonth();
                            currentDay = 1;
                            document.getElementById("day" + currentDay).style.color = "red";
                        }
                        else {
                            document.getElementById("day" + (currentDay + 1)).style.color = "red";
                            document.getElementById("day" + currentDay).style.color = "black";
                            currentDay += 1;
                        }
                    }
                }
            }
        })
    }
    function previousDayButtonEvent() {
        document.getElementById("calendar-previous-day").addEventListener("click", (e) => {
            if (currentDay - 1 == 0) {
                swtichToPreviousMonth();
                currentDay = 1;
                document.getElementById("day" + currentDay).style.color = "red";
                for (let i = 2; i < 50; i++) {
                    document.getElementById("day" + i).style.color = "black";
                }
            }

            document.getElementById("day" + (currentDay - 1)).style.color = "red";
            document.getElementById("day" + currentDay).style.color = "black";
            currentDay -= 1;
        })
    }
    function getFirstDayOfMonth(year, month) {
        if (new Date(year, month, 1).getDay() == 0) {
            return 7;
        }
        return new Date(year, month, 1).getDay();
    }
    function daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    function createCalendar() {
        const calendar = document.getElementById("calendar-wrapper");
        const section = document.createElement("section");
        calendar.appendChild(section);
        const labels = ["Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sat",
            "Su",
        ];

        for (let i = 0; i < labels.length; i++) {
            const div = document.createElement("div");
            div.textContent = labels[i];
            section.append(div);
        }
        var emptyDivCounter = 1;
        for (let i = 0; i < firstDayOfTheMonth - 1; i++) {
            const div = document.createElement("div");
            div.textContent = " ";
            div.setAttribute("id", "emptyDiv" + (emptyDivCounter));
            section.children[6 + i].insertAdjacentElement("afterend", div);
            emptyDivCounter += 1;
        }

        for (let i = 0; i < monthDays; i++) {
            const div = document.createElement("div");
            div.textContent = i + 1;
            div.setAttribute("id", "day" + (i + 1));
            section.appendChild(div);
        }
        for (let i = monthDays + firstDayOfTheMonth - 1; i < 50; i++) {
            const div = document.createElement("div");
            div.textContent = " ";
            div.setAttribute("id", "emptyDiv" + emptyDivCounter);
            section.children[6 + i].insertAdjacentElement("afterend", div);
            emptyDivCounter += 1;
        }
        document.getElementById("day" + currentDay).style.color = "red";
    }
    function nextMonthButtonEvent() {
        document.getElementById("calendar-next-month").addEventListener("click", (e) => {
            const shownMonth = document.getElementById("calendar-current-month");
            i += 1;
            if (i % 12 == 0) {
                i = 0;
                year += 1;
            }
            shownMonth.textContent = months[i % 12] + " " + year;
            const startingDay = getFirstDayOfMonth(year, i);
            const finalDay = daysInMonth(year, i + 1);
            monthDays = daysInMonth(year, i + 1);

            const calendar = document.getElementById("calendar-wrapper").getElementsByTagName("div");
            document.getElementById("day" + currentDay).style.color = "black";
            var emptyDivCounter = 1;


            for (let i = 8; i < 8 + startingDay - 1; i++) {
                calendar[i].textContent = " ";
                calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter)
                emptyDivCounter += 1;
            }

            var dayCounter = 1;

            for (let i = 8 + startingDay - 1; i < 8 + startingDay + finalDay - 1; i++) {
                calendar[i].textContent = dayCounter;
                calendar[i].setAttribute("id", "day" + dayCounter)
                dayCounter += 1;
            }

            for (let i = 8 + startingDay + finalDay - 1; i < (8 + startingDay + finalDay - 1) + 7; i++) {
                calendar[i].textContent = " ";
                calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter);
                emptyDivCounter += 1;
            }
            currentDay = 1;
            document.getElementById("day" + currentDay).style.color = "red";
        })
    }
    function previousMonthButtonEvent() {
        document.getElementById("calendar-previous-month").addEventListener("click", (e) => {

            const shownMonth = document.getElementById("calendar-current-month");
            i -= 1;
            if (i == -1) {
                year -= 1;
                i = 11;
            }
            shownMonth.textContent = months[i % 12] + " " + year;

            const startingDay = getFirstDayOfMonth(year, i);
            const finalDay = daysInMonth(year, i + 1);
            monthDays = daysInMonth(year, i + 1);


            const calendar = document.getElementById("calendar-wrapper").getElementsByTagName("div");

            var emptyDivCounter = 1;

            for (let i = 8; i < 8 + startingDay - 1; i++) {
                calendar[i].textContent = " ";
                calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter);
                emptyDivCounter += 1;
            }

            var dayCounter = 1;

            for (let i = 8 + startingDay - 1; i < 8 + startingDay + finalDay - 1; i++) {
                calendar[i].textContent = dayCounter;
                calendar[i].setAttribute("id", "day" + dayCounter);
                dayCounter += 1;
            }

            for (let i = 8 + startingDay + finalDay - 1; i < (8 + startingDay + finalDay - 1) + 7; i++) {
                calendar[i].textContent = " ";
                calendar[i].setAttribute("id", "emptyDiv" + emptyDivCounter);
                emptyDivCounter += 1;
            }
            currentDay = 1;
            document.getElementById("day" + currentDay).style.color = "red";
            for (let i = 2; i < 50; i++) {
                document.getElementById("day" + i).style.color = "black";
            }
        })
    }
});