# FactCheck

Gather claimReview metadata from a [snopes|politifact|factcheck|wapo] fact-check page, formulate an annotation, post it to the target of the fact-check page. 

Launch from a bookmarklet, e.g.:

javascript:(function(){var d=document,s=d.createElement('script');s.setAttribute('src','https://jonudell.info/h/FactCheck/gather.js');d.body.appendChild(s)})();
