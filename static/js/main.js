"use strict";
jQuery(document).on('ready', function() {
	/* MOBILE MENU*/
	function collapseMenu(){
		jQuery('.wt-navigation ul li.menu-item-has-children, .wt-navdashboard ul li.menu-item-has-children, .wt-navigation ul li.menu-item-has-mega-menu').prepend('<span class="wt-dropdowarrow"><i class="lnr lnr-chevron-right"></i></span>');
		jQuery('.wt-navigation ul li.menu-item-has-children span, .wt-navigation ul li.menu-item-has-mega-menu span').on('click', function() {
			jQuery(this).parent('li').toggleClass('wt-open');
			jQuery(this).next().next().slideToggle(300);
		});
		jQuery('.wt-navdashboard ul li.menu-item-has-children').on('click', function(){
			jQuery(this).toggleClass('wt-open');
			jQuery(this).find('.sub-menu').slideToggle(300);
		});
	}
	collapseMenu();
	
	/* PROGRESS BAR */
	if(jQuery('#wt-ourskill').length > 0){
		var _wt_ourskill = jQuery('#wt-ourskill');
		_wt_ourskill.appear(function () {
			jQuery('.skill-holder').each(function () {
				jQuery(this).find('.skill-bar').animate({
					width: jQuery(this).attr('data-percent')
				}, 2500);
			});
		});
	}
	
	/* Google Map */
	// if(jQuery('#wt-locationmap').length > 0){
	// 	var _wt_locationmap = jQuery('#wt-locationmap');
	// 	_wt_locationmap.gmap3({
	// 		marker: {
	// 			address: '1600 Elizabeth St, Melbourne, Victoria, Australia',
	// 			options: {
	// 				title: 'Robert Frost Elementary School'
	// 			}
	// 		},
	// 		map: {
	// 			options: {
	// 				zoom: 16,
	// 				scrollwheel: false,
	// 				disableDoubleClickZoom: true,
	// 			}
	// 		}
	// 	});
	// }
	var ulCategories = document.querySelectorAll('#id_subcategories  li');
	var ulCities = document.querySelectorAll('#id_cities li');
	function hideAllUl() {
		ulCategories.forEach(el => el.hidden= true);
		ulCities.forEach(el => el.hidden = true);
	}
	function setStyle() {
		document.getElementById('id_title_image').classList.add('wt-btn');
	} 
	hideAllUl();
	// setStyle();
	// Switch stars =======================================================
	function SwitchStars(){
		var spanlist = document.querySelectorAll('.rating-star');
		spanlist.forEach(el => {
			var rating = parseInt($(el).attr('data-rating'));
			var blank = el.firstElementChild;			
			if(rating) {
				for(var i=1; i<=rating; i++){	
					var clone = blank.cloneNode(true);					
					clone.hidden = false;
					el.appendChild(clone);					
				}
			}
		});
	}
	SwitchStars();
	// Load More ========================================================
	$(document).on('click', 'a.load-more',function(event){
		var link = location.href;
		var num_pages = $(this).data('pages');
		var page = $(this).data('page');
		page += 1;
		$(this).data('page', page);
		if( page <= num_pages){
			link =  link+"?page="+ page;
				$.ajax({
				'url': link,
				'dataType': 'html',
				'type': 'get',
				'success': function(data, status, xhr){
					var html = $(data).find('.items');
					$('.pages').append(html);
					SwitchStars();			
				}
			});
		}
		if( page == num_pages ){
		  $(this).hide();
	  }
	});
	// Paginator ==============================================================
	$(document).on('click', 'a.paginate', function(event){
		var link = $('#nav-paginate').data('url');		
		var page = $(this).data('page');
		if(link.includes('?')){
			link += '&page=' + page;
		} else {
			link += "?page=" + page;
		}
		if(link.includes('ajax')){
			$.ajax({
				'url': link,
				'dataType': 'json',
				'type': 'get',
				'success': function(data){
					$('#workers').html(data.html);
					$('html, body').animate({ scrollTop: 0 }, 'fast');								
				}
			});
		} else {
			$.ajax({
				'url': link,
				'dataType': 'html',
				'type': 'get',
				'success': function(data){							
					var html = $(data).find('.items');
					$('.pages').html(html);
					$('html, body').animate({ scrollTop: 0 }, 'fast');
				}
			});
		}
		
	});
	// Clone block ===============================
	jQuery('#add_new_tag').on('click', function(){
		var blank = document.querySelector('#tag_list').lastElementChild;
		var clone = blank.cloneNode(true);
		clone.hidden = false;
		document.querySelector('#tag_list').prepend(clone);
	});
	jQuery('#add_new_phone').on('click', function(){
		var blank = document.querySelector('#phone_list').lastElementChild;
		var clone = blank.cloneNode(true);
		clone.hidden = false;
		document.querySelector('#phone_list').prepend(clone);
	});
	jQuery('#add_new_photo').on('click', function(){
		var list = document.querySelector('#photo_list')
		var blank = list.lastElementChild;
		var clone = blank.cloneNode(true);
		clone.hidden = false;
		list.prepend(clone);
		if(list.childElementCount == 10) {
			document.getElementById('add_new_photo').hidden = true;
		}
	})
	// Dynamic category ==========================
	jQuery('#categories').on('change', function(){
		var category = $(this).val();
		var url = $(this).attr('data-url');
		document.getElementById('id_subcategories').classList.add('ulCheck');
		$.ajax({
			url: url,
			data: {'category': category},
			success: function(data){
				var arrIdCat = [];
				data.val.forEach(el => arrIdCat.push(el.id));
				ulCategories.forEach(el => {
					var inputId = parseInt(el.getElementsByTagName('input').subcategories.value);
					if( arrIdCat.includes(inputId)){
						el.hidden = false;
					} else {
						el.hidden = true;	
					}
					
				})
			}
		});
	});
	jQuery('#regions').on('change', function(){
		var region = $(this).val();
		var url = $(this).attr('data-url');
		document.getElementById('id_cities').classList.add('ulCheck');
		$.ajax({
			url: url,
			data: {'region': region},
			success: function(data){
				var arrIdRegions = [];
				data.val.forEach(el => arrIdRegions.push(el.id));
				ulCities.forEach(el => {
					var inputId = parseInt(el.getElementsByTagName('input').cities.value);
					if( arrIdRegions.includes(inputId)){
						el.hidden = false;
					} else {
						el.hidden = true;	
					}
					
				})
			}
		});
	});
	jQuery('#worker_list_regions').on('change', function(){
		var region = $(this).val();
		var url = $(this).attr('data-url');
		$.ajax({
			url: url,
			data: {'region': region},
			success: function(data) {
				$("#cities_list").html(data.html);
				var _wt_verticalscrollbar = jQuery('.wt-verticalscrollbar');
				_wt_verticalscrollbar.mCustomScrollbar({
					axis:"y",
				});
			}
		});
	});
	jQuery('#categories_list').on('change', function(){
		var category = $(this).val();
		var url = $(this).attr('data-url');
		$.ajax({
			url: url,
			data: {'category': category},
			success: function(data) {
				$("#subcategories_list").html(data.html);
				var _wt_verticalscrollbar = jQuery('.wt-verticalscrollbar');
				_wt_verticalscrollbar.mCustomScrollbar({
					axis:"y",
				});
			}
		});
	});
	jQuery('#filter-response').on('change', function(){
		var filter = $(this).val();
		var id = $(this).attr('data-id')
		var url = $(this).attr('data-url');
		$.ajax({
			url: url,
			data: {'filter': filter, 'id': id, 'url': url},
			success: function(data) {
				$("#response-list").html(data.html);
				SwitchStars();
			},
			error: function(error){
				console.log('error', error);
			}
		});
	});
	jQuery(document).on('click', '.wt-checkbox, .wt-filtertag', function(e){
		var cities = Array.from(document.getElementsByClassName('city'));
		var subcategories = Array.from(document.getElementsByClassName('subcategory'));
		var city_list = [];
		var subcategory_list = []
		var city = e.currentTarget.firstElementChild;
		var url = $("#cities_list").attr('data-url');
		var pk = $(document.getElementById('subcategories_list')).attr('data-pk');
		var tag = $("#tag").attr('data-tag');
		if(e.currentTarget.classList[0] === 'wt-filtertag') {
			$(this).hide();
			tag = '';
		}
		if(city){
			city.checked = !city.checked;
			cities.forEach(el => {			
				if( el.checked ) {
					city_list.push(el.value);				
				}
			});
		}
		subcategories.forEach(el => {
			if(el.checked) {
				subcategory_list.push(el.value);
			}
		});
		if(subcategory_list.length == 0 && pk) {
			subcategory_list.push(pk);
		}
		$.ajax({
			url: url,
			method: 'GET',
			data: { 'cities': city_list, 'subcategories': subcategory_list, 'tag': tag },
			success: function(data) {
				$('#workers').html(data.html);
				$('#length').html(data.length);
			},			
		});
	});
	// Preview photo ============================
	$('#id_title_image').on('change', function(){
		document.getElementById('previewTitle').src = window.URL.createObjectURL(this.files[0]);
	});
	
	$(document).on('change', '.portfolio', function(e){
		var spanImg = e.currentTarget.nextElementSibling;
		spanImg.firstChild.src = window.URL.createObjectURL(this.files[0]);
	});
	$('.submenu-btn').on('click', function(e){
		e.preventDefault();
		let subShow = e.currentTarget.nextElementSibling;
		subShow.hidden = !subShow.hidden;
		e.currentTarget.lastChild.classList.toggle('rotate');
	});
	// Delete block ==================================
	$(document).on('click', '.deletetag', function() {
		var li = $(this).closest('li');
		li.remove();
		if (li.attr('data-url')){
			$.ajax({
				url: li.attr('data-url'),
			});
		}
	});
	$(document).on('click', '.deletephone', function() {
		var li = $(this).closest('li');
		li.remove();
		if (li.attr('data-url')){
			$.ajax({
				url: li.attr('data-url'),
			});
		}
	});
	$(document).on('click', '.deletePhoto', function(){
		var li = $(this).closest('li');
		li.remove();
		if (li.attr('data-url')){
			$.ajax({
				url: li.attr('data-url'),
			});
		}
		var list = document.getElementById('add_new_photo');
		if(list.hidden) {
			list.hidden = false;
		}
	});
	$(document).on('click', '.delete-response', function() {
		var div = $(this).closest('div .wt-userlistingsingle');
		div.remove();
		if ($(this).attr('data-url')){
			$.ajax({
				url: $(this).attr('data-url'),
			});
		}
	});
	// Reply =========================================================
	var modal = document.getElementById('modal-reply');
	$(document).on('click', '.reply', function(){		
		$(modal).modal('show');
		var id = $(this).attr('data-id');
		var addReply = document.getElementById('response-id');
		$(addReply).attr('value', id);
	});
	$('#modal-reply').on('submit', '.modal-form', function(e){
		e.preventDefault()
		var id = $('#response-id').attr('value');
		var id_str = '#response-'+id;
		var form = $(this)
		var text = $('#text-reply').val();
		if(text){
			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				dataType: 'json',
				data: form.serialize(),
				success: function(data){
					$(id_str).append(data.reply);
					$(modal).modal('hide');
				}
			});
		}	
	});
	/*OPEN CLOSE */
	jQuery('#wt-loginbtn, .wt-loginheader a').on('click', function(event){
		event.preventDefault();
		jQuery('.wt-loginarea .wt-loginformhold').slideToggle();
	});
	jQuery('#wt-signUpbtn, .wt-signUpheader a').on('click', function(event){
		event.preventDefault();
		jQuery('.wt-signUparea .wt-signUpformhold').slideToggle();
	});
	/*OPEN CLOSE */
	jQuery('.wt-dropdown').on('click', function(event){
		event.preventDefault();
		jQuery('.wt-radioholder').slideToggle();
	});
	/* BANNER VIDEO */
	jQuery("a[data-rel]").each(function () {
		jQuery(this).attr("rel", jQuery(this).data("rel"));
	});
	jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({
		animation_speed: 'normal',
		theme: 'dark_square',
		slideshow: 3000,
		autoplay_slideshow: false,	
		social_tools: false
	});
	/* DROPDOWN RADIO */
	jQuery('input:radio[name="searchtype"]').on('change',
	    function(){
	        var _type = jQuery(this).data('title');
	        jQuery('.selected-search-type').html(_type);
	    }
    );
    /* COUNTER */
	try {
		var _wt_statistics = jQuery('#wt-statistics');
		_wt_statistics.appear(function () {
			var _wt_statistics = jQuery('.wt-statisticcontent h3');
			_wt_statistics.countTo({
				formatter: function (value, options) {
					return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
				}
			});
		});
	} catch (err) {}

	/* OUR PROFESSIONALS FILTERABLE*/
	var $container = jQuery('.wt-teamfilter');
	var $optionSets = jQuery('.option-set');
	var $optionLinks = $optionSets.find('a');
	function doIsotopeFilter() {
		if (jQuery().isotope) {
			var isotopeFilter = '';
			$optionLinks.each(function () {
				var selector = jQuery(this).attr('data-filter');
				var link = window.location.href;
				var firstIndex = link.indexOf('filter=');
				if (firstIndex > 0) {
					var id = link.substring(firstIndex + 7, link.length);
					if ('.' + id == selector) {
						isotopeFilter = '.' + id;
					}
				}
			});
			//$(window).load(function () {
				$container.isotope({
					//itemSelector: '.mb-productitem',
					filter: isotopeFilter
				});
			//});
			$optionLinks.each(function () {
				var $this = jQuery(this);
				var selector = $this.attr('data-filter');
				if (selector == isotopeFilter) {
					if (!$this.hasClass('mb-active')) {
						var $optionSet = $this.parents('.option-set');
						$optionSet.find('.mb-active').removeClass('mb-active');
						$this.addClass('mb-active');
					}
				}
			});
			$optionLinks.on('click', function () {
				var $this = jQuery(this);
				var selector = $this.attr('data-filter');
				$container.isotope({itemSelector: '.mb-project', filter: selector});
				if (!$this.hasClass('mb-active')) {
					var $optionSet = $this.parents('.option-set');
					$optionSet.find('.mb-active').removeClass('mb-active');
					$this.addClass('mb-active');
				}
				return false;
			});
		}
	}
	var isotopeTimer = window.setTimeout(function () {
		window.clearTimeout(isotopeTimer);
		doIsotopeFilter();
	}, 1000);

	/* DIRECTION AWARE HOVER*/
	jQuery(function () {
		jQuery('.wt-teamholder').each(function () {
			 jQuery(this).hoverdir();
		});
	});
	/* Brand Slider */
	var _wt_brandslider = jQuery("#wt-brandslider")
	_wt_brandslider.owlCarousel({
		item: 6,
		loop:false,
		nav:false,
		margin: 0,
		autoplay:false,
		responsiveClass:true,
		responsive:{
			0:{items:1,},
			481:{items:2,},
			768:{items:3,},
			991:{items:4,},
			992:{items:5,}
		}
	});
		$('#accordion').collapse({
	  toggle: false	
	})

	/* Team Slider */
	var _wt_categoriesslider = jQuery("#wt-categoriesslider")
	_wt_categoriesslider.owlCarousel({
		item: 6,
		loop:true,
		nav:false,
		margin: 0,
		autoplay:false,
		center: true,
		responsiveClass:true,
		responsive:{
			0:{items:1,},
			481:{items:2,},
			768:{items:3,},
			1440:{items:4,},
			1760:{items:6,}
		}
	});
	/* THEME VERTICAL SCROLLBAR */
	if(jQuery('.wt-verticalscrollbar').length > 0){
		var _wt_verticalscrollbar = jQuery('.wt-verticalscrollbar');
		_wt_verticalscrollbar.mCustomScrollbar({
			axis:"y",
		});
	}
	if(jQuery('.wt-horizontalthemescrollbar').length > 0){
		var _wt_horizontalthemescrollbar = jQuery('.wt-horizontalthemescrollbar');
		_wt_horizontalthemescrollbar.mCustomScrollbar({
			axis:"x",
			advanced:{autoExpandHorizontalScroll:true},
		});
	}
	/* TIPSO TOOLTIP */
	jQuery('.template-content').tipso({
			speed             : 400,        
			background        : '#fff',
			titleBackground   : '#3498db',
			color             : '#999999',
			titleColor        : '#ffffff',
			width             : 105,
			tooltipHover      : true,
			size :50,
			offsetY : 0,
			position: 'top-right'
		});

		jQuery('.hover-tipso-tooltip').tipso({
	    tooltipHover: true,
	});
	/* CONSULTATION FEE SLIDER */
	function ageRangeslider(){
		jQuery("#wt-productrangeslider").slider({
			range: true,
			min: 0,
			max: 150,
			values: [ 10, 110 ],
			slide: function( event, ui ) {
				jQuery( "#wt-consultationfeeamount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		jQuery( "#wt-consultationfeeamount" ).val( "$" + jQuery("#wt-productrangeslider").slider( "values", 0 ) + " - $" + jQuery("#wt-productrangeslider").slider( "values", 1 ));
	}
	if( jQuery("#wt-productrangeslider").length > 0 ){
		ageRangeslider();
	}
	/* SHORT DESCRIPTION */
	var _readmore = jQuery('.wt-userdetails .wt-description');
	_readmore.readmore({
		speed: 500,
		collapsedHeight: 230,
		moreLink: '<a class="wt-btntext" href="#">Read More</a>',
		lessLink: '<a class="wt-btntext" href="#">Less</a>',
	});
	/*  PROGRESS BAR */
	try {
		$('#wt-ourskill').appear(function () {
			jQuery('.wt-skillholder').each(function () {
				jQuery(this).find('.wt-skillbar').animate({
					width: jQuery(this).attr('data-percent')
				}, 2500);
			});
		});
	} catch (err) {}
	/* PRELOADER*/
	jQuery(window).on('load', function() {
		jQuery(".preloader-outer").delay(1000).fadeOut();
		jQuery(".loader").delay(500).fadeOut("slow");
	});
	/*OPEN CLOSE */
	jQuery('.wt-projectdropdown').on('click', function(event){
		event.preventDefault();
		jQuery('.wt-projectdropdown-option').slideToggle();
	});
	/* DROPDOWN RADIO */
	jQuery('input:radio[name="searchtype"]').on('change',
	    function(){
	        var _type = jQuery(this).data('title');
	        jQuery('.selected-search-type').html(_type);
	    }
    );
    /* SIDEBAR DROPDOWN */
	jQuery('.wt-usersidebardown').on('click', function(event){
		event.preventDefault();
		jQuery('.wt-usersidebar').slideToggle();
	});

	/* Lost passowrd Box */
	jQuery('.wt-forgot-password').on('click', function (e) {     
		jQuery('.do-login-form').addClass('wt-hide-form');
		jQuery('.wt-loginheader span').html('Reset Password');
		jQuery('.do-forgot-password-form').removeClass('wt-hide-form');
	});
	jQuery('.wt-show-login').on('click', function (e) {       
		jQuery('.do-login-form').removeClass('wt-hide-form');
		jQuery('.wt-loginheader span').text('Login');
		jQuery('.do-forgot-password-form').addClass('wt-hide-form');
	});
	/* SEARCH CHOSEN */
	var config = {
		'.chosen-select'           : {},
		'.chosen-select-deselect'  : {allow_single_deselect:true},
		'.chosen-select-no-single' : {disable_search_threshold:10},
		'.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
		'.chosen-select-width'     : {width:"95%"}
		}
		for (var selector in config) {
			jQuery(selector).chosen(config[selector]);
	}
	
	/* CHATBOX TOGGLE  */
	jQuery('#wt-btnclosechat, #wt-getsupport').on('click', function(){
		jQuery('.wt-chatbox').slideToggle();
	});
	/* DASHBOARD MENU */
	if(jQuery('#wt-btnmenutoggle').length > 0){
		jQuery("#wt-btnmenutoggle").on('click', function(event) {
			event.preventDefault();
			jQuery('#wt-wrapper').toggleClass('wt-openmenu');
			jQuery('body').toggleClass('wt-noscroll');
			jQuery('.wt-navdashboard ul.sub-menu').hide();
		});
	}
	/* FIXED SIDEBAR */
	function fixedNav(){			
		$(window).scroll(function () {			
		var $pscroll = $(window).scrollTop();						
			if($pscroll > 76){
			 $('.wt-sidebarwrapper').addClass('wt-fixednav');
			}else{
			 $('.wt-sidebarwrapper').removeClass('wt-fixednav');
			}
		});
	}
	fixedNav();

	/* ADD Class */
	jQuery('.wt-myskills .wt-addinfo').on('click', function() {
		var _this = jQuery(this);
		_this.parents('li').addClass('wt-skillsaddinfo');
	});
	jQuery('.wt-myskills .wt-deleteinfo').on('click', function() {
		var _this = jQuery(this);
		var _val = _this.parents('li').find('.skill-dynamic-field input').val();
		_this.parents('li').find('.skill-dynamic-html .skill-val').html(_val);
		_this.parents('li').removeClass('wt-skillsaddinfo');
	});
	/* Dashboard Slider */
	var _wt_postedsilder = jQuery("#wt-postedsilder")
	_wt_postedsilder.owlCarousel({
		item: 6,
		loop:true,
		nav:true,
		margin: 10,
		autoplay:false,
		responsiveClass:true,
		navClass: ['wt-prev', 'wt-next'],
		navContainerClass: 'wt-slidernav',
		navText: ['<span class="lnr lnr-chevron-left"></span>', '<span class="lnr lnr-chevron-right"></span>'],
		responsive:{
			0:{items:1,},
			720:{items:2,},
		}
	});
	/* TINYMCE WYSIWYG EDITOR */
	if(jQuery('#wt-tinymceeditor').length > 0){
		tinymce.init({
			selector: 'textarea#wt-tinymceeditor',
			height: 300,
			theme: 'modern',
			plugins: [ 'advlist autolink lists link image charmap print preview hr anchor pagebreak'],
			menubar: false,
			statusbar: false,
			toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify',
			image_advtab: true,
		});
	}
	
	jQuery('.wt-savefollow').on('click', function(){
		event.preventDefault();
		$(this).parents('li').remove();
	});
	
	/* ADD AND REMOVE CLASS  */
	if(jQuery('.wt-ad').length > 0){
		var _wt_ad = jQuery('.wt-ad');
		_wt_ad.on('click',function () {
			jQuery(this).parents('.wt-messages-holder').addClass('wt-openmsg');
			jQuery(this).parent().parents('.wt-messages-holder').addClass('wt-openmsg');
		});
		var _wt_back = jQuery('.wt-back');
		_wt_back.on('click',function () {
			jQuery('.wt-back').parents('.wt-messages-holder').removeClass('wt-openmsg');
		});
	}
	
	/* JRATE STARS  */
	jQuery(function () {
		var that = this;
		var toolitup = $("#wt-jrate").jRate({
			rating: 5.0,
			strokeColor: '#dadadacc',
			precision: 1,
			startColor: "#fecb02",
			endColor: "#fecb02",
			backgroundColor: '#ddd',
			minSelected: 1,
			shapeGap: '10px',
			count: 5,
			onChange: function(rating) {
				jQuery('.counter').text(rating + '');
			},
			onSet: function(rating) {
				console.log("OnSet: Rating: "+rating);
			}
		});
	});
	
	jQuery(function () {
		var that = this;
		var toolitup = $("#wt-jrateone").jRate({
			rating: 4.0,
			strokeColor: '#dadadacc',
			precision: 1,
			startColor: "#fecb02",
			endColor: "#fecb02",
			backgroundColor: '#ddd',
			minSelected: 1,
			shapeGap: '10px',
			count: 5,
			onChange: function(rating) {
				jQuery('.counterone').text(rating + '');
			},
			onSet: function(rating) {
				console.log("OnSet: Rating: "+rating);
			}
		});
	});	
	
	jQuery(function () {
		var that = this;
		var toolitup = $("#wt-jratetwo").jRate({
			rating: 3.0,
			strokeColor: '#dadadacc',
			precision: 1,
			startColor: "#fecb02",
			endColor: "#fecb02",
			backgroundColor: '#ddd',
			minSelected: 1,
			shapeGap: '10px',
			count: 5,
			onChange: function(rating) {
				jQuery('.countertwo').text(rating + '');
			},
			onSet: function(rating) {
				console.log("OnSet: Rating: "+rating);
			}
		});
	});	
	
	jQuery(function () {
		var that = this;
		var toolitup = $("#wt-jratethree").jRate({
			rating: 2.0,
			strokeColor: '#dadadacc',
			precision: 1,
			startColor: "#fecb02",
			endColor: "#fecb02",
			backgroundColor: '#ddd',
			minSelected: 1,
			shapeGap: '10px',
			count: 5,
			onChange: function(rating) {
				jQuery('.counterthree').text(rating + '');
			},
			onSet: function(rating) {
				console.log("OnSet: Rating: "+rating);
			}
		});
	});	
	
});
	
