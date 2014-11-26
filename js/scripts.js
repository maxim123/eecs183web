// Returns a jQuery object that is an HTML tag of type elementType
function createElement(elementType)
{
    return $(document.createElement(elementType));
}

$(document).ready(function ()
{
	loadPage();
	loadStaffContent();

	$("#sidebar-wrapper li").click(function()
	{
		target = $('> a', this).attr("href");
		if ($(this).hasClass('active') && target[0] == '#')
		{
			changePage();
		}
	});

	window.onhashchange = changePage;
	
	$('#logout-button').click(function()
	{
		document.cookie = 'cosign-www=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
        document.cookie = 'cosign=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = 'https://weblogin.umich.edu/cgi-bin/logout?https://www.umich.edu/~eecs183/';
	});
	
	var currentWidth = $(window).width();
	
	$(window).resize(function()
	{
		if ($(window).width() < 1474)
		{
			$('#tutoring-calendar').height($(window).height() - 52);
		}
		else
		{
			$('#tutoring-calendar').height($(window).height() - 67);
		}
		
		$('#hours-calendar').height($(window).height() - 168);
		
		$('#gradebook-items').height($(window).height() - 122);
		
		if ($(window).width() != currentWidth)
		{
			// clear div
			$('#cover').html('');
			loadCover();
			currentWidth = $(window).width();
		}
	});
	
	// tutorials scrolling
	$('#tutorials-view').scrollspy({ target: '#tutorials-header' });
	
	
// cookies


/*
	if ($.cookie("exam2-review") == null)
	{
		// alert("Project 3 tutorial is tomorrow (Sunday) at 6 p.m. in 1800 CHEM");
		$('#announcement-exam2-review').modal('show');
	}
	
	
	// track attendance
	$('.exam2-review').on('click', function() {
		$.cookie("exam2-review", "announcement", {expires: 7});
		ga('send', 'event', 'exam2-review', $(this).html());
		$('#announcement-exam2-review').modal('hide');
	});
*/



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

// repositions visible popover during resize
$(window).resize(function ()
{
    if (LAST_LIVE_POPOVER)
        LAST_LIVE_POPOVER.popover("show");
    
})

function loadPage()
{
    LAST_LIVE_POPOVER = undefined; // reset upon page change
    IS_MOUSE_IN_POPOVER = false;
	var page = window.location.hash.substring(1);
	var path = 'pages/';
	
	// TODO: dynamically figure out which pages are available 
	var validPages = {
		'home': '',
		'calendar': 'Calendar',
		'syllabus': 'Syllabus',
		'resources': 'Resources',
		'lectures': 'Lectures',
		'gallery': 'Gallery',
		'gradebook': 'Gradebook',
		'gradebook2': 'Gradebook 2',
		'autograder': 'Autograder',
		'staff': 'Staff',
		'183style': '183style',
		'piazza': 'Piazza',
		'proposal': 'Proposal',
		'oh': 'Office Hours',
		'logout': 'Log Out',
		'apply': 'Application',
		'teams': 'Teams',
		'tutorials': 'Tutorials',
		'tutoring': 'Tutoring',
		'staff-project5-grading': 'Project 5 Grading',
		'staff-files': 'Staff Files'
	};
	
	// staff content
	if (page.indexOf('staff-') == 0)
	{
		path = 'staff-only/';
		/* $('#staff-only-link').click(); */
	}
	
	if (page == 'projects')
	{
		$('#projects-link').click();
	}
	
	if ((page == 'style' || page == '183style') && $('#style-link').hasClass('collapsed'))
	{
		$('#style-link').click();
	}
	
	if (!(page in validPages))
	{
		page = 'home';
	}
	
	document.title = 'EECS 183'
	if (page != 'home')
	{
		document.title += ': ' + validPages[page];
	}
	console.log(path + page + '.html');
	$("#sidebar-wrapper li").removeClass("active");
	$("#" + page + "-button").addClass("active");
	$('#content').load(path + page + '.html', function (response, status, xhr)
	{
		if (page == 'gallery' && status == 'success')
		{
			loadGalleryImages();
			
		}
		
		if (page == "staff-project5-grading" && status == "success")
	    {
		    loadStaffGallery();
		}
		
		if (page == "home" && status == "success")
	    {
		    loadCover();
		}
		
		
	    if (page == "staff" && status == "success")
	    {
	        populateStaffPage();
            
            var popoverOptions = {
                placement: "bottom",
                trigger: "manual",
                delay: {"show": 0, "hide":1},
                title: function() {
                    return $(this).parents(".staff-member").find(".staff-member-name").html()
                },
                content: function() {
                    return $(this).parents(".staff-member").find(".staff-info").html()
                },
                html: true,
                viewport: "body",
            };

            // create popover elements attached to img-wrapper
            $(".staff-member").each(function()
            {
                popoverOptions.container = $(this);
                $(".img-wrapper", this).popover(popoverOptions)
            });

            // manually display popover on mouseover
            $(".staff-member").hover(function()
            {
                $(".img-wrapper", this).popover("show");
            })
            .mouseleave(function()
            {
                $(".img-wrapper", this).popover("hide");
            })
            .click(function() // handles the mobile bug
            {
            	$(".img-wrapper", this).popover("toggle");
            });
        }
        else if (page == "tutorials" && status == "success")
        {
	        /*
var tag = $('#tutorials').createElement('script');
	        tag.src = "https://www.youtube.com/player_api";
	        var firstScriptTag = $('#tutorials').getElementsByTagName('script')[0];
	        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	        var player;
	        function onYouTubePlayerAPIReady() {
	            tutorial1Player = new YT.Player('tutorial1-player', {
	                height: '720',
	                width: '1280',
	                videoId: 'yzpXIV4Lrk4'
	            });
	        }
*/
        }
	});
}

function removeProgressWheel()
{
	$('.progress-wheel').remove();
}


/* gallery background colors */
function changeBackground(page)
{
	var scroll_pos = 0;
    var animation_begin_pos = 0;
    var animation_end_pos = $('#'+page).height();
    var beginning_color = new $.Color('#D38AB7');
    var ending_color = new $.Color('#85C4E5');
    $(document).scroll(function() {
        scroll_pos = $(this).scrollTop(); 
        if(scroll_pos >= animation_begin_pos && scroll_pos <= animation_end_pos)
        { 
        
            var percentScrolled = scroll_pos / (animation_end_pos - animation_begin_pos);
            var newRed = beginning_color.red() + ((ending_color.red() - beginning_color.red()) * percentScrolled);
            var newGreen = beginning_color.green() + ((ending_color.green() - beginning_color.green()) * percentScrolled);
            var newBlue = beginning_color.blue() + ((ending_color.blue() - beginning_color.blue()) * percentScrolled);
            var newColor = new $.Color(newRed, newGreen, newBlue);
            
            $('#'+page).animate({
	            backgroundColor: newColor
	            
            }, 0);
        }
        else if (scroll_pos > animation_end_pos)
        {
             $('#'+page).animate({
	             backgroundColor: ending_color
	         }, 0);
        }
        else if (scroll_pos < animation_begin_pos )
        {
             $('#'+page).animate({
	             backgroundColor: beginning_color
	             
             }, 0);
        } else { }
    });
}

/* home page cover */
function loadCover()
{
	var path = 'https://www.umich.edu/~eecs183/gallery/images/';
	$.ajax(
	{
		url: path,
		success: function(data)
		{
			var images = [];
			//alert(data);
			$(data).find("a:contains(.png)").each(function(){
				// will loop through 
				images[images.length] = $(this);
				//alert("Found a file: " + );
			});
			//alert(images.toString());
			populateCover(images, path);
		}
	});
	
}

function populateCover(images, path)
{
	images = shuffleArray(images);
	var imgDimension = 64;
	var maxColumns = 20;
	var numRows = Math.floor($('#cover').height() / imgDimension);
	var numColumns = Math.floor(Math.min($('#cover').width(), imgDimension * maxColumns) / imgDimension);
	//alert(numColumns);
	
	// clear div
	$('#cover').html('');
	
	for (var i = 0; i < numRows; i++)
	{
		for (var j = 0; j < numColumns; j++)
		{
			/*
if (numColumns % 2 && i == Math.floor(numRows / 2) && j == Math.floor(numColumns / 2))
			{
				var img = createElement("div").addClass("cover-title");
				img.html("183");
				$('#cover').append('<span class="cover-title">183</span>');
			}
			else
			{
*/
				
				

				var imgContainer = createElement('a');
				imgContainer.attr('href', '#gallery');
				imgContainer.attr('onClick', "ga('send', 'event', 'link', 'click on Gallery', 'home');");
				// var img = createElement("img").addClass("cover-image").attr("src", path + images[i * numColumns + j].attr("href"));
				//imgContainer.append(img);
				//$('#cover').append(imgContainer/* .append(img) */);
				

				
				
				var img = createElement("img").addClass("cover-image").attr("src", path + images[i * numColumns + j].attr("href"));
				$('#cover').append(imgContainer.append(img));
				
			// }
		}
		$('#cover').append('<br/>');
	}
}


/* gallery images */
function loadGalleryImages()
{
	
	var path = 'https://www.umich.edu/~eecs183/gallery/images2x/';
	$.ajax(
	{
		url: path,
		success: function(data)
		{
			var images = [];
			//alert(data);
			$(data).find("a:contains(.png)").each(function(){
				// will loop through 
				if ($(this).attr('href') != 'shihand.png')
				{
					images[images.length] = $(this);
				}
				//alert("Found a file: " + );
			});
			populateImageGallery(images, path, true);
			changeBackground('gallery');
		}
	});
}

function loadStaffGallery()
{
	var path = 'https://www.umich.edu/~eecs183/gallery/images2x/';
	$.ajax(
	{
		url: path,
		success: function(data)
		{
			var images = [];
			//alert(data);
			$(data).find("a:contains(.png)").each(function(){
				// will loop through 
				images[images.length] = $(this);
				
				//alert("Found a file: " + );
			});
			populateImageGallery(images, path, false);
		}
	});
}


function populateImageGallery(images, path, random)
{
	var NUM_COLMNS = 12,
    MAX_IMAGES_IN_ROW = { // values must be multiples of NUM_COLUMNS
        lg: 3,
        md: 2,
        sm: 2,
        xs: 1,
    };
    
    if (random)
    {
		images = shuffleArray(images);
		images
	}
	else
	{
		// temp
		MAX_IMAGES_IN_ROW['lg'] = 2;
		MAX_IMAGES_IN_ROW['xs'] = 2;
	}
	/*
for (var i = 0; i < images.length; i++)
	{
		$('#gallery-images').append('<img src="' + path + images[i] + '" alt="' + images[i] + '" class="gallery-image">');
		//images[i].appendTo();
	}
*/
	
	
	var numImages = images.length,
        columnWidths = {};

    var imagesRow = $('#gallery-images');
    for (var i = 0; i < numImages; i++)
    {
        var image = images[i],
            imageElement = createElement("div").addClass("gallery-item"),
            //imgWrapper = createElement("div").addClass("gallery-img-wrapper"),
            img = createElement("img").addClass("gallery-image").attr("src", path + images[i].attr("href")),
            authorName = createElement("p").addClass("gallery-image-author");

        // determine column widths
        for (var attr in MAX_IMAGES_IN_ROW)
        {
            var maxInRow = MAX_IMAGES_IN_ROW[attr];
            // check if grid row for given size has been filled
            if (i % maxInRow == 0)
            {
                // update row
                if (maxInRow >= numImages - i)
                    columnWidths[attr] = NUM_COLMNS / (numImages - i);
                else
                    columnWidths[attr] = NUM_COLMNS / maxInRow;
            }
        }

        // place column width classes on staff-member element
        for (var attr in columnWidths)
            imageElement.addClass("col-" + attr + "-" + columnWidths[attr]);


        // append children
        imageElement.append(img);
        imageElement.append(authorName.text(image.text().replace('.png', '')));

        // append to row
        imagesRow.append(imageElement);
    }
	imagesRow.resize();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


function loadStaffContent()
{
	$.get('staff-only/navigation.html', function(data)
	{
		$(data).insertBefore('#logout-button');
		$('#staff-only-button').hide().slideDown();
		
	});
	
	$.get('staff-only/project-list.html', function(data) {
		$('#project-list').append(data);
	});
	
}




/**************** POPULATING STAFF PAGE *****************/

var NUM_COLMNS = 12,
    MAX_STAFF_IN_ROW = { // values must be multiples of NUM_COLUMNS
        md: 4,
        sm: 3,
        xs: 2,
    };
function getProfessors()
{
    return _instructors.professors;
}
function getGSIs()
{
    return _instructors.GSIs;
}


function createStaffInfo(instructorDef)
{
    if (instructorDef == undefined)
    {
        console.log("createStaffInfo::instructorDef is undefined");
        return;
    }

    var infoContainer = createElement("div").addClass("hidden staff-info"),
        content;


    // append classes
    var classInfo = createElement("div").addClass("staff-info-category");
    if (instructorDef.lectures.length)
    {
        var lectureContainer = createElement("div").addClass("staff-lecture-wrapper");
        appendClasses("Lecture", instructorDef.getLectureSections(), lectureContainer);
        classInfo.append(lectureContainer);
    }
    if (instructorDef.discussions.length)
    {
        var discussionContainer = createElement("div").addClass("staff-dicussion-wrapper");
        appendClasses("Discussion", instructorDef.getDiscussionSections(), discussionContainer);
        classInfo.append(discussionContainer);
    }
    if (classInfo.children().length)
        infoContainer.append(classInfo);


    // append contact info
    var contactInfo = createElement("div").addClass("staff-info-category");
    if (instructorDef.email)
    {
        var emailContainer = createElement("div").addClass("staff-email-wrapper");
        content = createElement("a").attr("href", "mailto:" + instructorDef.email).text(instructorDef.email);
        emailContainer.append(content);

        contactInfo.append(emailContainer);
    }
    if (instructorDef.website)
    {
        var websiteContainer = createElement("div").addClass("staff-website-wrapper");
        content = createElement("a").attr("href", instructorDef.website).attr("target","_blank").text(instructorDef.website);
        websiteContainer.append(content);

        contactInfo.append(websiteContainer);
    }
    if (contactInfo.children().length)
        infoContainer.append(contactInfo);


    // append concentration
    var concentrationInfo = createElement("div").addClass("staff-info-category");
    if (instructorDef.concentration.majors.length)
    {
        var majorsContainer = createElement("div").addClass("staff-majors-wrapper");
        appendConcentration("", instructorDef.concentration.majors, majorsContainer);
        concentrationInfo.append(majorsContainer);
    }
    if (instructorDef.concentration.minors.length)
    {
        var label = "Minor in ",
            minorsContainer = createElement("div").addClass("staff-minors-wrapper");
        if (instructorDef.concentration.minors.length > 1)
            label = "Minors in "
        appendConcentration(label, instructorDef.concentration.minors, minorsContainer);
        concentrationInfo.append(minorsContainer);
    }
    if (concentrationInfo.children().length)
        infoContainer.append(concentrationInfo);


    return infoContainer;
}


// Requires: timestamp is a string in the format hh:mm[:ss]
function formatTimeStamp(timestamp)
{
    timestamp = timestamp.split(":");
    timestamp[0] = parseInt(timestamp[0]);

    var daytimeLabel = "am";
    if (timestamp[0] >= 12)
        daytimeLabel = "pm";
    if (timestamp[0] > 12) // convert from 24 hr to 12 hr
        timestamp[0] -= 12;

    return timestamp[0] + ":" + timestamp[1] + daytimeLabel;
}
function formatClassTime(section)
{
    var dayAbbrev = section.days[0][0],
        formattedTime;


    // append days of the week
    formattedTime = dayAbbrev
    if (dayAbbrev == "T" && section.days[0][1] == "h")
        formattedTime += "h";
    else if (dayAbbrev == "T" && section.days[0][1] == "u")
        formattedTime += "u";
    for (var i = 1; i < section.days.length; i++)
    {
        dayAbbrev = section.days[i][0];
        if (dayAbbrev == "T" && section.days[i][1] == "h")
            dayAbbrev += "h";
	    else if (dayAbbrev == "T" && section.days[0][1] == "u")
	        formattedTime += "u";
        formattedTime += ", " + dayAbbrev;
    }


    // append start and end times
    var startTime = formatTimeStamp(section.startTime),
        endTime = formatTimeStamp(section.endTime);
    formattedTime += " " + startTime + "-" + endTime + " " + section.room;

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

    var labelText = concentrationTitle,
        content = createElement("span"),
        label = createElement("span").text(labelText);

    content.append(createElement("span").text(concentrationArray[0]))
    for (var i = 1; i < concentrationArray.length; i++)
    {
        var textVal = concentrationArray[i];
        textVal = ", " + textVal;
        content.append(createElement("span").text(textVal));
    }

    container.append(label).append(content);
}


function populateInstructorRow(instructorGetter, rowSelector)
{
    if (typeof instructorGetter != "function")
    {
        console.log("populateInstructorRow::instructorGetter isn't a function");
        return;
    }
    if (typeof rowSelector == undefined)
    {
        console.log("populateInstructorRow::rowSelector is undefined");
        return;
    }

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
            // check if grid row for given size has been filled
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

        // append to row
        instructorRow.append(staffMemberElement);
    }
}
function populateStaffPage()
{
    populateInstructorRow(getProfessors, "#professor-row");
    populateInstructorRow(getGSIs, "#gsi-row");
}
