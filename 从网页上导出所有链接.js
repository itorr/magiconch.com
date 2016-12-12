
var 
A={};

document.querySelectorAll('a').forEach(function(a){

	href=a.href;
	text=(a.innerText+'').trim().replace(/访问/ig,'');

	if(href && href.match(/^https?:\/\/[^\/]+\/?$/) && text){


		domain=href.
			replace(/^https?:\/\//,'').
			replace(/^www\./,'').
			replace(/\/.*$/,'');

		O={
			href: href,
			title: text
		};

		title='';

		if(text.match(/\n/)){
			text=text.split(/\n/);

			title=text.shift();

			text=text.join('');

			O.title=title;

			O.text=text;
		}

		A[domain]=O;


		console.log(domain,title,text);
	}
})
A;


copy(JSON.stringify(A).replace(/\},/g,"},\n"));


