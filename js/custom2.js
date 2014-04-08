jQuery( document ).ready(function( $ ) {

	// Get and parse XML file into HTML upon opening of application
	$.ajax({
	  //absolute path to xml file
	  url: 'http://www.brettdavidconnolly.com/data.xml',
	  dataType: 'xml',
	  success: function(xml){

	  	//set a page numbering index variable
	  	//initialize arrays containing header data
	  	page_index = 1;
	  	header_array = [];
	  	header_array['title'] = [];
	  	header_array['info'] = [];

	  	//loop through each main category tag in the xml
	  	$(xml).find('main-category').each(function(index,value){

	  		//get category title and information, create main_category_selector
	  		main_title = $(this).find('main-title').text();
	  		main_info  = $(this).find('main-info').text();

	  		$('#dpn_header').append('<section data-category="'+ index +'" id="category_header_'+ index +'" class="category_header"><h2>'+ main_title +'</h2><p>'+ main_info +'</p></section>');

	  		//Loop through each sub category tag in the xml
	  		$(this).find('sub-category').each(function(){

	  			//get sub category title, create sub_category_selector
				sub_title = $(this).find('sub-title').text();
	  			sub_category_selector = '#sub_category_' + page_index;
	  			
	  			//Create elements to be placed in each slide (sub category), append to body
	  			$('main').append('<section data-category="' + index + '" class="main_category_' + index + ' slide" id="sub_category_' + page_index + '"><div class="sub_cat_holder"><img class="sub_main_img" src="http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg" alt="image"><h3>'+ sub_title +'</h3><ul></ul></div><p class="right_arrow">&#10095;</p><p class="left_arrow"> &#10094;</p></section>');
	  			
	  			//Loop through any sub category descriptions and append to the slide's 'ul' 
	  			$(this).find('sub-description').each(function(){
	  				sub_description = $(this).text();
	  				$(sub_category_selector+" ul").append('<li>' + sub_description + '</li>');
	  			});

	  			//Increment page_index variable
	  			page_index++;
	  		})
	  	});
		
		//set the 'data-is-active' attribute to true which is used to 
		//find out which header is currently being displayed
		$('#dpn_header :first-child').show().attr('data-is-active', true);

		 // lock scrolling
	    disableScroll();

		//Set each slides width to the size of the window
		$('.slide').width($(window).width());

		//Set each slides height to the size of the window
		$('.slide').height($(window).height());

		adjustHeaderHeight();

		//event handler for slide swiping
		$(".slide").swipe({
	  		swipe:function(event, direction, distance, duration, fingerCount) {

	  			//get slide elements for slide animation
	  			current_slide   = $(this);
	  			next_slide      = $(this).next();
	  			previous_slide  = $(this).prev();
	  			current_slide_class  = $(current_slide).attr('class');
	  			next_slide_class 	 = $(next_slide).attr('class');
	  			previous_slide_class = $(previous_slide).attr('class');
	  			current_header = $('.category_header[data-is-active="true"]');
	  			next_header = $(current_header).next();
	  			previous_header = $(current_header).prev();

	  			//if user swipes left, check if next slide exists
	  			//then animate to next slide
	  			if (direction == "left") {
		  			if(next_slide.length>0){
						if (current_slide_class != next_slide_class){
							$(current_header).attr('data-is-active', false).fadeOut(500, function(){
								$(next_header).attr('data-is-active', true).fadeIn(500);
							});
						}

			  			$('html, body').animate({
							scrollLeft: $(next_slide).offset().left
						},{ duration: 1000, queue: true});

			  		} else {
						console.log("end of slides");
					}
				}

				//if user swipes right, check if previous slide exists
	  			//then animate to previous slide
				if (direction == "right") {
					if(previous_slide.length>0){
						if (current_slide_class != previous_slide_class){
							$(current_header).attr('data-is-active', false).fadeOut(500, function(){
								$(previous_header).attr('data-is-active', true).fadeIn(500);
							});
						}
						
			  			$('html, body').animate({
							scrollLeft: $(previous_slide).offset().left
						}, 1000);
			  		} else {
						console.log("end of slides");
					}
				}
	  		}
		});


	  } /* end of ajax success function */
	}); /* end of ajax call */


});

function adjustHeaderHeight() {
	header_height = $('#dpn_header').height();
	$('.slide').css('padding-top', header_height);
}

function disableScroll() {
	 var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
      ];
      var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
      html.data('scroll-position', scrollPosition);
      html.data('previous-overflow', html.css('overflow'));
      html.css('overflow', 'hidden');
      window.scrollTo(scrollPosition[0], scrollPosition[1]);
}