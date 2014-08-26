$(document).ready(function()
{
	loadPage();

	$("#sidebar-wrapper li").click(function()
	{
		target = $('> a', this).attr("href");
		if ($(this).hasClass('active') && target[0] == '#')
		{
			changePage();
		}
	});

	window.onhashchange = changePage;
});

function changePage()
{
	loadPage();
	
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	ga('create', 'UA-54268018-1', 'auto');
	ga('send', 'pageview', {
		'page': location.pathname + location.search + location.hash
	});
}

var LAST_LIVE_POPOVER = undefined;

$(window).resize(function ()
{
    if (LAST_LIVE_POPOVER)
    {
        // repositions visible popover during resize
        LAST_LIVE_POPOVER.popover("show");
    }
})

function loadPage()
{
	var page = window.location.hash.substring(1);
	
	// TODO: dynamically figure out which pages are available 
	var validPages = ['home', 'calendar', 'syllabus', 'resources', 'lectures', 'gradebook', 'autograder', 'staff', 'style', 'piazza'];
	
	if (page == 'projects')
	{
		$('#projects-link').click();
	}
	
	if ($.inArray(page, validPages) === -1)
	{
		page = 'home';
	}
	
	document.title = 'EECS 183'
	if (page != 'home')
	{
		document.title += ': ' + page.charAt(0).toUpperCase() + page.substring(1);
	}
	
	$("#sidebar-wrapper li").removeClass("active");
	$("#" + page + "-button").addClass("active");
	$('#content').load('pages/' + page + '.html', function (response, status, xhr)
	{
	    if (page == "staff" && status == "success") {
	        populateStaffPage();
            
            $(".staff-member img").click(function() {
                var currentPopover = $(this);
                if (LAST_LIVE_POPOVER)
                {
                    if (LAST_LIVE_POPOVER[0] === currentPopover[0])
                    {
                        // popover already handles toggle, don't need to do anything
                        return;
                    }
                    else
                    {
                        LAST_LIVE_POPOVER.popover("destroy");
                        LAST_LIVE_POPOVER = undefined;
                    }
                }

                var popoverOptions = {
                    container: "#wrapper #content",
                    placement: "bottom"
                };
                popoverOptions.content = $(this).parents(".staff-member").find(".staff-info").html();
                popoverOptions.html = true;
                currentPopover.popover(popoverOptions).popover("show");
                LAST_LIVE_POPOVER = currentPopover;
            });
        }
	});	
}

function removeProgressWheel()
{
	$('.progress-wheel').remove();
}

// Returns a jQuery object that is an HTML tag of type elementType
function createElement(elementType)
{
    return $(document.createElement(elementType));
}

function getProfessors()
{
    return _instructors.professors;
}

function getGSIs()
{
    return _instructors.GSIs;
}


var NUM_COLMNS = 12,
    MAX_STAFF_IN_ROW = { // values must be multiples of NUM_COLUMNS
        md: 4,
        sm: 3,
        xs: 2,
    };


function populateInstructorRow(instructorGetter, rowSelector)
{
    var instructorDef = instructorGetter(),
        numInstructors = instructorDef.length,
        columnWidths = {};

    var instructorRow = $(rowSelector);
    for (var i = 0; i < numInstructors; i++)
    {
        var instructor = instructorDef[i],
            staffMemberElement = createElement("div").addClass("staff-member"),
            imgWrapper = createElement("div").addClass("img-wrapper"),
            img = createElement("img").addClass("img-responsive").attr("src", instructor.getImagePath()),
            staffName = createElement("p").addClass("staff-member-name");


        // determine column widths
        for (var attr in MAX_STAFF_IN_ROW)
        {
            var maxInRow = MAX_STAFF_IN_ROW[attr];
            // check if row for given size has been filled
            if (i % maxInRow == 0)
            {
                // update row
                if (maxInRow >= numInstructors - i)
                    columnWidths[attr] = NUM_COLMNS / (numInstructors - i);
                else
                    columnWidths[attr] = NUM_COLMNS / maxInRow;
            }
        }

        // place column width classes on staff-member element
        for (var attr in columnWidths)
            staffMemberElement.addClass("col-" + attr + "-" + columnWidths[attr]);


        // append children
        staffMemberElement.append(imgWrapper.append(img));
        staffMemberElement.append(staffName.text(instructor.getInstructorName()));
        staffMemberElement.append(createStaffInfo(instructor));

        // append to container
        instructorRow.append(staffMemberElement);
    }
}
function createStaffInfo(instructorDef)
{
    if (instructorDef == undefined)
        return;

    var infoContainer = createElement("div").addClass("hidden staff-info"),
        lectureContainer = createElement("div").addClass("staff-lecture-wrapper"),
        discussionContainer = createElement("div").addClass("staff-dicussion-wrapper"),
        websiteContainer = createElement("div").addClass("staff-website-wrapper"),
        emailContainer = createElement("div").addClass("staff-email-wrapper"),
        majorsContainer = createElement("div").addClass("staff-majors-wrapper"),
        minorsContainer = createElement("div").addClass("staff-minors-wrapper"),
        label,
        content;

    if (instructorDef.lectures.length)
    {
        appendClasses("Lecture Section", instructorDef.getLectureSections(), lectureContainer);
        infoContainer.append(lectureContainer);
    }
    if (instructorDef.discussions.length)
    {
        appendClasses("Discussion Section", instructorDef.getDiscussionSections(), discussionContainer);
        infoContainer.append(discussionContainer);
    }
    if (instructorDef.website)
    {
        label = createElement("span").text("Website: ");
        content = createElement("a").attr("href", instructorDef.website).text(instructorDef.website);
        websiteContainer.append(label).append(content);
        
        infoContainer.append(websiteContainer);
    }
    if (instructorDef.email)
    {
        label = createElement("span").text("Email: ");
        content = createElement("a").attr("href", "mailto:" + instructorDef.email).text(instructorDef.email);
        emailContainer.append(label).append(content);

        infoContainer.append(emailContainer);
    }
    if (instructorDef.concentration.majors.length)
    {
        appendConcentration("Major", instructorDef.concentration.majors, majorsContainer);
        infoContainer.append(majorsContainer);
    }
    if (instructorDef.concentration.minors.length)
    {
        appendConcentration("Minor", instructorDef.concentration.minors, minorsContainer);
        infoContainer.append(minorsContainer);
    }

    return infoContainer;
}
function formatTimeStamp(timestamp)
{
    timestamp = timestamp.split(":");
    timestamp[0] = parseInt(timestamp[0]);
    var daytimeLabel = "am";
    if (timestamp[0] >= 12)
        daytimeLabel = "pm";
    if (timestamp[0] > 12)
        timestamp[0] -= 12;

    return timestamp[0] + ":" + timestamp[1] + daytimeLabel;
}
function formatClassTime(section)
{
    var formattedTime = section.days[0] + "s";
    for (var i = 1; i < section.days.length; i++)
    {
        formattedTime += ", " + section.days[i] + "s";
    }

    var startTime = formatTimeStamp(section.startTime),
        endTime = formatTimeStamp(section.endTime);

    formattedTime += " " + startTime + "-" + endTime;

    return formattedTime;
}
function appendClasses(classType, classArray, container)
{
    var labelText = classType + (classArray.length > 1 ? "s" : ""),
        label = createElement("span").text(labelText),
        content = createElement("ul");
    for (var i in classArray)
    {
        content.append(createElement("li").text(formatClassTime(classArray[i])));
    }

    container.append(label).append(content);
}
function appendConcentration(concentrationTitle, concentrationArray, container)
{
    if (concentrationTitle == undefined || concentrationArray == undefined ||
        container == undefined)
        return;

    var labelText = concentrationTitle + (concentrationArray.length > 1 ? "s" : ""),
        content = createElement("ul"),
        label = createElement("span").text(labelText);

    for (var i in concentrationArray)
        content.append(createElement("li").text(concentrationArray[i]));

    container.append(label).append(content);
}
function populateStaffPage()
{
    populateInstructorRow(getProfessors, "#professor-row");
    populateInstructorRow(getGSIs, "#gsi-row");
}
