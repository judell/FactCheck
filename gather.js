var payload;

var data = {
  urlOfFactCheck: location.href,
  targetUri: [],
  url: null,
  claimReviewed: null,
  itemReviewed: {},
  reviewRating: {},
}

function tryMicrodata(data) {

  var itemReviewed = document.querySelector("*[itemprop=itemReviewed]");

  if (itemReviewed) {
    try {
      var url = getValue(itemReviewed.querySelectorAll("*[itemprop=url]"));
      if (url) {
        data.url = url;
        data.targetUri.push(url);
      }

      var author = itemReviewed.querySelector("*[itemprop=author]");
      if (author) {
        data.itemReviewed.author = {};
        data.itemReviewed.author.name = getValue(author.querySelector("*[itemprop=name]"));
        data.itemReviewed.author.jobTitle = getValue(author.querySelector("*[itemprop=jobTitle]"));

        data.itemReviewed.author.sameAs = getValue(author.querySelector("*[itemprop=sameAs]"));
        if ( data.itemReviewed.author.sameAs ) {
          data.targetUri.push(data.itemReviewed.author.sameAs);
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  var claimReviewed = document.querySelector("*[itemprop=claimReviewed]");

  if (claimReviewed) {
    data.claimReviewed = getValue(claimReviewed);
  }

  var reviewRating = document.querySelector("*[itemprop=reviewRating]");

  if (reviewRating) {
    try {
      data.reviewRating.alternateName = getValue(reviewRating.querySelector("*[itemprop=alternateName]"));
      data.reviewRating.ratingValue = getValue(reviewRating.querySelector("*[itemprop=ratingValue]"));
      data.reviewRating.bestRating = getValue(reviewRating.querySelector("*[itemprop=bestRating]"));
      data.reviewRating.worstRating = getValue(reviewRating.querySelector("*[itemprop=worstRating]"));
    }
    catch (e) {
      console.log(e);
    }
  }

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

function getValue(element) {
  var value = null;
  try {
    if ( element.content) {
      value = element.content;
    }
    else if  (element.innerText != '') {
      value = element.innerText;
    }
  }
  catch (e) {
    console.log(e);
  }
  return value;
}

function gather() {

  data = tryJsonLd(data);

  if (! data.claimReviewed ) {
    data = tryMicrodata(data);
  }

  payload = JSON.stringify(data);

  location.href = 'https://jonudell.info/h/FactCheck?url=' + encodeURIComponent(payload);
}

gather();