console.log('Script loaded');
document.addEventListener("DOMContentLoaded", function() {
    //Create/add stars to layers
    const starLayers = document.querySelectorAll('.star-layer');
    
    starLayers.forEach(layer => {
      for (let i = 0; i < 60; i++) {
        const star = document.createElement('li');
        star.className = 'star';
        layer.appendChild(star);
      }
    })
    const stars = document.querySelectorAll('.star');

     //Randomize star position
    stars.forEach(star => {
        star.style.top = Math.floor(Math.random() * 99) + "%";
        star.style.left = Math.floor(Math.random() * 99) + "%";
    })

    //Randomize exhaust fume position
    const fumes = document.querySelectorAll('.smoke-cloud');

    fumes.forEach(cloud => {
        cloud.style.top = Math.floor(Math.random() * 50) + "%";
        cloud.style.left = Math.floor(Math.random() * 101) + "%";
    })

    setInterval(function() {

        fumes.forEach(cloud => {
            cloud.style.display = "none";
            cloud.style.top = Math.floor(Math.random() * 50) + "%";
            cloud.style.left = Math.floor(Math.random() * 101) + "%";
            cloud.style.display = "block";
        })
    }, 2950);
    
    const $starLayers = document.getElementsByClassName("star-layer");
    const $body = document.getElementsByTagName("body");
    const $rocket = document.getElementById("svg-rocket");
    const $moon = document.getElementById("moon");
    const $fire = document.getElementById("fire");
    const $trail = document.getElementById("trail");
    const $galaxy = document.getElementById("svg-galaxy");
    const $flash = document.getElementById("flash");
    const $milestones = document.getElementById("milestone-wrapper");
    const $title = document.getElementById("title");
    const $undraw = document.getElementById("undraw");
    const $options = document.querySelectorAll(".planet");

    const tl = new TimelineLite({});
    tl.to($fire, 0.3, {
            opacity: 0,
            repeat: 3
        })
        .to($trail, 0.2, {
            opacity: 1
        })
        .call(function() {
            $rocket.classList.remove("rocket-hover");
            $rocket.classList.add("rocket-shake");
        })
        .to($rocket, 1, {
            bottom: 150,
            delay: 0.6
        })
        .to($trail, 0.5, {
            height: 400
        }, "-=1")
        .to($moon, 3, {
            transform: "scale(7)",
            top: "50%",
            right: -1200,
            ease: Power0.easeIn,
            delay: 2
        }, "-=2")
        .to($galaxy, 2, {
            transform: "scale(1)",
            left: -400,
            top: "40%"
        }, "-=1")
        .to($rocket, 0.5, {
            bottom: "120%"
        }, "-=0.5")
        .to($trail, 0.5, {
            height: 1800
        }, "-=0.5")
        .to($flash, 0.3, {
            width: 10,
            height: "100%"
        }, "-=0.2")
        .to($flash, 0.3, {
            width: "100%",
            height: "100%"
        })
        .call(function() {
            document.getElementById('space').remove();
            $("html").css("overflow", "auto");
            $("#flash").remove();
        })
        .to($milestones, 2, {
            opacity: 1,
            display: "flex",
        })
        .to($title, 1, {
            opacity: 1
        }, "-=1")
         // .staggerTo($options, .6, {transform: "scale(1)", opacity: 1}, 0.2, "-=1")



         $(".planet-wrapper").click(function() {
            $(".planet-wrapper").addClass("choice-selected").removeClass("current-choice");
            $(this).addClass("current-choice");
            $("#milestone-wrapper").addClass("choice-selected");
        
            var tlData = $(this).data("tl");
            var data = window[tlData];
        
            $("#tl").html("").addClass("tl-show");
            data.forEach(function(item) {
                var date = item.date ? "<h2 class='date-line'>" + item.date + "</h2>" : "";
                $("#tl").append("<div class='timeline-item'><div class='timeline-icon'><i class='fas fa-star'></i></div><div class='timeline-content'>" + date + "<p>" + item.content + "</p></div></div>");
            });
            $("#tl").append('<div class="scroll-top"><i class="fas fa-chevron-up"></i></div>');
            $(".scroll-top").click(function() {
                window.scrollTo(0,0);
            });
        
            const timelineItems = $('.timeline-item');
            timelineItems.each(function(index) {
                if (index > 0) {
                    if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.9) {
                        $(this).find('.timeline-content, .timeline-icon').addClass('hidden');
                    }
                }
            });
        
            $("#tl").hide().fadeIn();
        
            $(window).on('scroll', function() {
                timelineItems.each(function() {
                    if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.9 && $(this).find('.timeline-content, .timeline-icon').hasClass('hidden')) {
                        $(this).find('.timeline-content, .timeline-icon').removeClass('hidden').addClass('bounce');
                    }
                });
            });
        
            // Check if the clicked element is the second planet-wrapper
            if ($(this).index() === 0) {
                $("#info-table").show(); // Show the info table if the second planet is clicked
                $("#sankey_chart").hide();
                $(".timeline-item").hide();
                $(".scroll-top").hide();
                $(".timeline").hide();
                $(".tl-show").hide();
                // $(".timeline tl-show").hide();
            } else {
                if ($(this).index() === 2) {
                    $("#sankey_chart").show();
                    $("#info-table").hide(); // Hide the info table otherwise
                    $(".timeline-item").hide();
                    $(".scroll-top").hide();
                    $(".timeline").hide();
                    $(".tl-show").hide();
                    
                }
                else{
                $("#info-table").hide(); // Hide the info table otherwise
                $("#sankey_chart").hide();
                $(".timeline-item").show();
                }
                
            }
        });
        

        document.getElementById('newApplicationForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting via the browser
        
            // Collect form data
            const formData = {
                company: document.getElementById('company').value,
                Job_title: document.getElementById('Job_title').value,
                status: document.getElementById('status').value,
                description: document.getElementById('description').value,
                // Include other fields as necessary
            };
            console.log('FormData:', formData);
        
            // Send data to Flask endpoint using Fetch API
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Handle success - maybe close modal and clear form
                modal.style.display = 'none';   
                // Optionally, clear the form here
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
// Add an event listener to the button
$('.cover-letter-btn').on('click', function() {
    // Get the application number from the button's data attribute
    var applicationNumber = $(this).data('application-number');
    
    // Send a POST request to the Flask route to generate the cover letter
    $.ajax({
        url: '/generate-cover-letter/' + applicationNumber,
        type: 'POST',
        success: function(response) {
            // On success, show the generated cover letter in a modal or popup
            var coverLetter = response.cover_letter;
            showModal(coverLetter);
        },
        error: function(xhr, status, error) {
            // On error, show an alert with the error message
            alert('Failed to generate cover letter: ' + error);
        }
    });
});

// Function to show modal with cover letter
function showModal(coverLetter) {
    // Create a modal element
    var modal = $('<div class="modal">').appendTo('body');
    
    // Add cover letter content to the modal
    modal.html('<div class="modal-content">' + coverLetter + '</div>');
    
    // Add a close button to the modal
    modal.find('.modal-content').append('<button class="close">Close</button>');
    
    // Show the modal
    modal.show();
    
    // Add event listener to close the modal when close button is clicked
    modal.find('.close').on('click', function() {
        modal.hide();
    });
}




        
    // $(".planet-wrapper").click(function() {
    //     $(".planet-wrapper").addClass("choice-selected");
    //     $(".planet-wrapper").removeClass("current-choice");
    //     $(this).addClass("current-choice");
    //     $("#milestone-wrapper").addClass("choice-selected");
    //     var tlData = $(this).data("tl");
    //     var data = window[tlData];
    //     $("#tl").html("");
    //     $("#tl").addClass("tl-show");
    //     data.forEach(function(item) {
    //         var date = item.date ? "<h2 class='date-line'>" + item.date + "</h2>" : "";
    //         $("#tl").append("<div class='timeline-item'><div class='timeline-icon'><i class='fas fa-star'></i></div><div class='timeline-content'>" + date + "<p>" + item.content + "</p></div></div>");
    //     });
    //     $("#tl").append('<div class="scroll-top"><i class="fas fa-chevron-up"></i></div>');
    //   $(".scroll-top").click(function() {
    //     window.scrollTo(0,0);
    //   })
    //     const timelineItems = $('.timeline-item');
    //     timelineItems.each(function(index) {
    //       if (index > 0) {
    //         if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.9) {
    //             $(this).find('.timeline-content, .timeline-icon').addClass('hidden');
    //         }
    //       }
            
    //     });

    //     $("#tl").hide().fadeIn();

    //     $(window).on('scroll', function() {
    //         timelineItems.each(function() {
    //             if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.9 && $(this).find('.timeline-content, .timeline-icon').hasClass('hidden')) {
    //                 $(this).find('.timeline-content, .timeline-icon').removeClass('hidden').addClass('bounce');
    //             }
    //         });
    //     });


    // })
    $(document).ready(function() {
        $(".TableHolder tr").hover(
            function() {
                // Apply the translucent class to the entire row on hover
                $(this).addClass("TRTranslucent");
            },
            function() {
                // Remove the translucent class when no longer hovering
                $(this).removeClass("TRTranslucent");
            }
        );
    
        // Optionally, if you want to keep the background-color change for the headers as well
        $(".TableHolder tr td").hover(
            function() {
                // Optionally change the background color of the corresponding header on hover
                $(this)
                    .closest("table")
                    .find("th")
                    .css("background-color", "rgba(0,0,0,0.1)");
            },
            function() {
                // Reset the background color of the header when no longer hovering
                $(this)
                    .closest("table")
                    .find("th")
                    .css("background-color", "inherit");
            }
        );
    });

    function showPopup() {
        document.getElementById('popup').style.display = 'block';
    }

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("openModalButton");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Function to add application data to the table
    function addApplication() {
        var table = document.querySelector(".TableHolder");
        var row = table.insertRow(-1); // Insert a row at the end of the table
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = table.rows.length - 1; // Assuming the first row is the header
        cell2.innerHTML = document.getElementById("companyName").value;
        cell3.innerHTML = document.getElementById("jobRole").value;
        cell4.innerHTML = document.getElementById("status").value;

        modal.style.display = "none"; // Hide the modal
    }

    function addApplication() {
        var companyName = document.getElementById('companyName').value;
        var jobRole = document.getElementById('jobRole').value;
        var status = document.getElementById('status').value;

        // Create a new row and cells
        var table = document.querySelector('.TableHolder');
        var newRow = table.insertRow(-1); // Insert a row at the end of the table
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);

        // Add text to the new cells:
        cell1.innerHTML = table.rows.length - 1; // This assumes no other rows are deleted
        cell2.innerHTML = companyName;
        cell3.innerHTML = jobRole;
        cell4.innerHTML = status;

        // Clear inputs after insertion
        document.getElementById('companyName').value = '';
        document.getElementById('jobRole').value = '';
        document.getElementById('status').value = '';

        // Hide modal after submission
        document.querySelector('.modal').style.display = 'none';
    }

    // Event listener for the submit button in the form
    document.getElementById('newApplicationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting via the browser
        addApplication();
    });

    // To open modal
    document.getElementById('openModalBtn').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'block';
    });

    // To close modal
    document.querySelector('.close').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
    });

    // Click outside modal to close it
    window.onclick = function(event) {
        var modal = document.querySelector('.modal');
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }



});

function editApplication(applicationNumber, company, Job_title, status, description) {
    document.getElementById('edit_application_number').value = applicationNumber;
    document.getElementById('edit_company').value = company;
    document.getElementById('edit_job_title').value = Job_title;
    document.getElementById('edit_status').value = status;
    document.getElementById('edit_description').value = description;
    
    document.getElementById('editApplicationModal').style.display = 'block';
}

function submitEditApplication() {
    const applicationNumber = document.getElementById('edit_application_number').value;
    const company = document.getElementById('edit_company').value;
    const Job_title = document.getElementById('edit_job_title').value;
    const status = document.getElementById('edit_status').value;
    const description = document.getElementById('edit_description').value;

    const updatedData = { company, Job_title, status, description };
    fetch(`/update_job/${applicationNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.reload(); // Reload the page to update the table
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('editApplicationModal').style.display = 'none';
}




var demos = [{
        date: "March 25, 2018",
        content: "Presentation: Perspective on Technology-Based Solutions National Association of Workforce Innovation – The Forum 2018"
    },
    {
        date: "April 12, 2018",
        content: "Demonstration to Regional IT Directors"
    },
    {
        date: "May 14, 2018",
        content: "Demonstration at the Committee Meeting"
    },
    {
        date: "June 8, 2018",
        content: "Demonstration to Central Staff"
    },
    {
        date: "June 21, 2018",
        content: "Demonstration to West Staff"
    },
    {
        date: "July 12, 2018",
        content: "Demonstration to Board of Directors"
    },
    {
        date: "August 2, 2018",
        content: "CFO addressed project during opening."
    },
    {
        date: "",
        content: "Demonstration at Innovation Expo"
    },
    {
        date: "August 7, 2018",
        content: "Demonstration for County Progress Planning"
    },
];

var development = [{
        date: "April 26, 2024",
        content: "PWC"
    },
    {
        date: "May 10, 2024",
        content: "THG"
    },
    {
        date: "May 12, 2024",
        content: "Booking.com"
    },
    {
        date: "May 22, 2024",
        content: "Barcalys"
    },
    {
        date: "May 28, 2024",
        content: "Lloyds Bank"
    },
    {
        date: "May 30, 2024",
        content: "Microsoft"
    },
    {
        date: "June 1, 2024",
        content: "Facebook"
    },
    {
        date: "June 14, 2024",
        content: "JP Morgan"
    },
    {
        date: "June 18, 2024",
        content: "Uber"
    },
    {
        date: "June 21, 2024",
        content: "Google"
    },
    {
        date: "July 1, 2024",
        content: "Amazon"
    },
];

var rollout = [
      {
        date: "April 12, 2018",
        content: "Demonstration to IT Directors"
    },
    {
        date: "May 14, 2018",
        content: "Demonstration at Committee Meeting"
    },
      {
        date: "March 14, 2019",
        content: "Regional Webcasts"
    },
        {
        date: "May 1, 2019",
        content: "Region 6 Adoption"
    },
        {
        date: "May 14, 2018",
        content: "Region 11 Adoption"
    },
  {
        date: "June 1, 2019",
        content: "Region 22 Adoption"
    },
        {
        date: "June 10, 2018",
        content: "Feature update statewide webcasts"
    },
]



document.addEventListener("DOMContentLoaded", function() {
    const jobAnalysisButton = document.querySelector('.planet-wrapper[data-tl="rollout"]'); // Button or element to trigger the chart generation

    jobAnalysisButton.addEventListener('click', function() {
        fetch('/api/job_status_summary')
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data); // Log the data to the console
                generateSankeyChart(data);
                // generatePieChart(data);
            })
            .catch(error => console.error('Error fetching job status data:', error));
    });

    function generateSankeyChart(data) {
        google.charts.load('current', {'packages':['sankey']});
        google.charts.setOnLoadCallback(function() {
            var googleData = new google.visualization.DataTable();
            googleData.addColumn('string', 'From');
            googleData.addColumn('string', 'To');
            googleData.addColumn('number', 'Weight');
        
            data.forEach(item => {
                var toColumn = item.status + ' (' + item.count + ')';
                googleData.addRows([
                    ['Applications', toColumn, item.count]
                ]);
            });          

            var options = {
                width: 400,
                height: 300
            };

            var chart = new google.visualization.Sankey(document.getElementById('sankey_chart'));
            chart.draw(googleData, options);
        });
    }
}
);