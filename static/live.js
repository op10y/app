document.addEventListener('DOMContentLoaded', function () {
        

    const about2 = document.getElementById("about2");
    const contact = document.getElementById("dhContact");
    const contactBtn = contact?.querySelector(".dh-contact-btn");

    if (!about2 || !contact) return;


    /* =====================================================
       DETECT WHEN DAR HARDWARE SECTION IS ON SCREEN
       ===================================================== */

    const aboutObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    /* SHOW FLOATING CONTACT */
                    contact.classList.add("dh-contact-active");

                } else {

                    /* HIDE FLOATING CONTACT */
                    contact.classList.remove("dh-contact-active");

                    /* Close menu when leaving section */
                    if (contactBtn) {
                        contactBtn.blur();
                        contactBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }

            });

        },
        {
            threshold: 0.25
        }
    );


    aboutObserver.observe(about2);


    /* =====================================================
       BUTTON ACCESSIBILITY
       ===================================================== */

    if (contactBtn) {

        contactBtn.addEventListener("click", function () {

            const expanded =
                contactBtn.getAttribute("aria-expanded") === "true";

            contactBtn.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

        });

    }

});