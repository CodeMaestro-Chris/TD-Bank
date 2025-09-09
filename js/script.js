    const track = document.getElementById("carouselTrack");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");

    let scrollPos = 0;
    const cardWidth = 250; // adjust for actual card + gap

    rightArrow.addEventListener("click", () => {
        scrollPos += cardWidth;
        track.style.transform = `translateX(-${scrollPos}px)`;
        leftArrow.style.display = "flex";
        // hide right arrow if end reached
        if (scrollPos + track.parentElement.offsetWidth >= track.scrollWidth) {
        rightArrow.style.display = "none";
        }
    });

    leftArrow.addEventListener("click", () => {
        scrollPos -= cardWidth;
        if (scrollPos <= 0) {
        scrollPos = 0;
        leftArrow.style.display = "none";
        }
        rightArrow.style.display = "flex";
        track.style.transform = `translateX(-${scrollPos}px)`;
    });


