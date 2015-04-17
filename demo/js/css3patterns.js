(function(){

	var patterns = document.querySelectorAll('#patterns > li'),
		recentPattern = null,
		currentPattern = null;
	
	for(var i=0; i<patterns.length; i++) {
		var pattern = patterns[i];
		
		pattern.onclick = function(evt) {
			// Firefox has focus issues if we don't restrict this
			if(!/textarea/i.test(evt.target.nodeName)) {
				location.hash = '#' + this.id;
			}
		};
	}
	
	(onhashchange = function() {
		var pattern = location.hash ? document.querySelector('#patterns li' + location.hash) : null;
		
		if(pattern) {
			recentPattern = currentPattern = pattern;
			document.body.className = 'patternfocus';
			pattern.snippet.subjects[1] = document.body;
		}
		else {
			currentPattern = null;
			document.body.className = '';
			
			if(recentPattern) {
				delete recentPattern.snippet.subjects[1];
			}
		}
	})();
})();