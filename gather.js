var payload;

var data = {
  urlOfFactCheck: location.href,
  targetUri: [],
  reviewRating: {},
  itemReviewed: {},
}

  function tryMicrodata(data) {
    try {
      data.claimReviewed = document.querySelector('*[itemprop="claimReviewed"]').content;
    } catch (e) {data.claimReviewed = null}

    try {
      data.reviewRating.alternateName = document.querySelector('*[itemprop="alternateName"]').innerText;
    } catch (e) {}

    try {
      data.reviewRating.ratingValue = document.querySelector('*[itemprop="ratingValue"]').innerText;
    } catch (e) {}

    try {
      data.reviewRating.bestRating = document.querySelector('*[itemprop="bestRating"]').innerText;
    } catch (e) {}

    try {
      data.reviewRating.bestRating = document.querySelector('*[itemprop="worstRating"]').innerText;
    } catch (e) {}

    try {
      data.itemReviewed.author = document.querySelector('*[itemprop="author"]').content;
    } catch (e) {}

    try {
      data.itemReviewed.datePublished = document.querySelector('*[itemprop="datePublished"]').content;
    } catch (e) {}

    try {
      data.itemReviewed.name = document.querySelector('*[itemprop="name"]').content;
    } catch (e) {}

    try {
      data.itemReviewed.sameAs = document.querySelector('*[itemprop="sameAs"]').content;
      if ( data.itemReviewed.sameAs ) {
        data.targetUri.push(data.itemReviewed.sameAs);
      }
    } catch (e) {}

    return data;
  }

function tryJsonLd(data) {
  var scripts = document.querySelectorAll('script');
  var json;
  scripts.forEach(function(scrpt) {
    if ( scrpt.innerText.indexOf('claimReviewed') != -1 ) {
      json = JSON.parse(scrpt.innerText);
	  if ( json['@type'] !== 'ClaimReview' ) {
        try {
          json = json.mainEntity.review;
		}
		catch (e) {
          console.log('no ClaimReview found');
		}
	  }
	  if ( json['@type'] === 'ClaimReview' ) {
        data.claimReviewed = json.claimReviewed;
        data.reviewRating = json.reviewRating;
        data.itemReviewed = json.itemReviewed;
        if (data.itemReviewed.sameAs instanceof Array) {
          data.targetUri.push(data.itemReviewed.sameAs[0]);
        }
        if (data.itemReviewed.author.sameAs instanceof Array) {
          data.targetUri.push(data.itemReviewed.author.sameAs[0]);
        }
	  }
    }
  });

  return data;
}

function gather() {

  debugger;

  var claimReviewed;

  data = tryJsonLd(data);

  if (! data.claimReviewed ) {
    data = tryMicrodata(data);
  }

  payload = JSON.stringify(data);

  location.href = 'https://jonudell.info/h/FactCheck?url=' + encodeURIComponent(payload);
}

gather();