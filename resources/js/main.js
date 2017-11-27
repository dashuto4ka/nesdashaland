/*function appearTop() {
	document.getElementById('top').style.opacity = "1";
} */

// JQUERY

jQuery(document).ready(function() {

	// GEMS

	$('.combo').mouseover(function() {
		$(this).find('h4').css('transform', 'scale(1.4)');
		$(this).find('.top').css('opacity', '1');
	});

	$('.combo').mouseout(function() {
		$(this).find('h4').css('transform', 'scale(1)');
		$(this).find('.top').css('opacity', '0');
	});

	// MUSIC

	$('.music-button').mouseover(function() {
		$('.after').css('visibility', 'visible');
		$('.before').css('visibility', 'hidden');
	});

	$('.music-button').mouseout(function() {
		$('.after').css('visibility', 'hidden');
		$('.before').css('visibility', 'visible');
	});

	$('.fa-play').click(function() {
		$('.audio-player').css('display', 'block');
	});

	$('.fa-times').click(function() {
		$('.audio-player').css('display', 'none');
	});

	$('.game-button').mouseover(function() {
		$('.game-after').css('visibility', 'visible');
		$('.game-before').css('visibility', 'hidden');
	});

	$('.game-button').mouseout(function() {
		$('.game-after').css('visibility', 'hidden');
		$('.game-before').css('visibility', 'visible');
	});

	$('.no').click(function() {
		$('.game-after').css('visibility', 'hidden');
		$('.game-before').css('visibility', 'visible');
	});
}); 

// 






