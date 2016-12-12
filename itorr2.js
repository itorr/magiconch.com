var iTorr=function(W,D,_b,_,__){

	_=function(i,p){
		return (p||D).querySelector(i);
	};
	__=function(i,p){
		return toArr((p||D).querySelectorAll(i));
	};

	
	var 
	trim=function(text){
		return (text+'').replace(/^\s+|\s+$/g,'')
	},
	toArr=_.toArr=function(r){
		return Array.prototype.slice.apply(r)
	},
	_F=Function,
	_D=Element.prototype,
	_S=String.prototype,
	_N=Number.prototype,
	_A=Array.prototype,
	_O=Object.prototype,
	en=encodeURIComponent,
	de=decodeURIComponent;

	_D.css=function(i){
		if(!i)
			return this.style.cssText;

		this.style.cssText+=(';'+i);
		return this
	};


	_D._=function(i){
		return _(i,this);
	};
	_D.__=function(i){
		return __(i,this);
	};

	/* 按照表达式获取父级 */
	_D.parent=function(i){
		var 
		o=this;

		var 
		doms=__(i);

		if(!doms)
			return;

		while(
			(o=o.parentNode)
			&&
			o!=document.body
		){

			if(-1!=doms.indexOf(o)){
				return o;
			}

		}
	};



	/*正则*/
	_.Ex={
		userName:/`|~|%|!|@|#|\^|=|'|\?|~|！|￥|…|&|—|‘|”|“|\？|\*|\(|\)|（|）|，|,|。|\.|、| |　|\"/,
		email:/^\w[\w\-_\.+]{0,}@(?:\w|\-_)+\.[\w\-]{2,}\.?[\w\-]{0,}$/i,
		password:/^.{1,}$/i,
		phone:/^\d{8,13}$/,
		authcode:/^\d{4}$/,
		ppwd:/^.{1,}$/,
		fullPath:/^(http|:|\/\/)/
	};

	_.replaceUrls=function(H){
		return H;

		return H.replace(/\{(contextPath|ajaxCtxPath|masadoraPath|toranoanaPath|cqueenPath|surugayaPath|bookoffPath|amazonPath|toranoanaJpWebsite|cqueenJpWebsite|surugayaJpWebsite|bookoffJpWebsite|amazonJpWebsite|staticPath)\}/g,function(all,key){
			return window[key];
		})
	};
	_.clone=function(o){
		var k,ret=o,b;
		if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
			ret = b ? [] : {};
			for(k in o)
				if(o.hasOwnProperty(k))
					ret[k] = _.clone(o[k]);
		}
		return ret;
	};
	_.x=function(d){
		return function(){
			var
			method,url,data,func,err,x,j,
			par,
			arg=toArr(arguments);

			if(arg[0]&&typeof arg[0]=='string'&&arg[0].match(/^(put|get|post|delete)$/i))
				method=arg.shift().toUpperCase();


			if(arg[0]&&typeof arg[0]=='object')
				par=arg.shift();

			url=arg.shift();


			if(arg[0]&&typeof arg[0]=='object'){
				dd=arg.shift();
				data=[];
				for(var i in dd)
					data.push(en(i)+'='+en(dd[i]));

				data=data.join('&');
			}else if(arg[0]&&typeof arg[0]=='string')
				data=arg.shift();
			else
				data='';

			if(!method)
				method=data?'POST':'GET';

			if(arg[0]&&typeof arg[0]=='function')
				func=arg.shift();

			if(arg[0]&&typeof arg[0]=='function')
				err=arg.shift();

			
			if(d[url]&&method=='GET')
				return func(_.clone(d[url]));
			
			
			(x=new XMLHttpRequest()).open(method,url,1);

			if(arg[0]&&arg[0]=='x')
				x.withCredentials=true;


			if((!url.match(location.origin))){//&&url.match(/\?/))
				x.withCredentials=true;
			}

			// 
			console.log(x.withCredentials,url);


			//console.log(par)
			if(par)
				for(var k in par)
					x[k]=par[k];
			
		

			!data||x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

			if(func||err)
				x.onreadystatechange=function(){
					if(x.readyState==4){
						if((x.status>199&&x.status<301)||x.status==304){
							//console.log(x)


							/* 非同步模式时执行的回调 */
							if(x.dom){
								x.dom.classList.remove('shade-box');
							}





							if(x.responseType=='blob')
								j=x.response;
							else
								j=x.responseText;


							try{
								if((x.getResponseHeader('Content-Type')||'').match(/json/)){
									j=JSON.parse(j||null);
								}
							}catch(e){
								if(err){
									err(e);
								}
							}

							if(!data)
								d[url]=j;


							var 
							r=_.x.filter(j);

							if(r===false)
								return;

							func(_.clone(r));
						}else if(err){
							if(!x.status)
								return console.log('status 为 0 的 XHR 错误');

							err(x.status);
						}

					}
				};

			setTimeout(function(){
				if(!x.notSend)
					x.send(data);
			});
			//x.send(data);
			return x;
		};
	}({});


/*
通用的 AJAX 不可预料错误处理
*/
var 
xhrError=function(){
	console.log(/出了不可预料错误/);

	ui.alert('服务器卖了个萌OwQ');
},
_alert=function(text,func){

	if(ui.alert){
		ui.alert(text,func);
	}else{
		alert(text);
		if(func)
			func();
	}
};


_.apiErrorMsgs={
};

_.xhrError=xhrError;
/*
通用的 AJAX 成功后，错误回调
*/
_.xhrSuccess=function(success,error,that){


	return function(r){

		if(r&&typeof r=='string'){
			return _alert('服务器错误',error);
		}

		if(r&&r.error){
			if(r.error=='NO_LOGIN_PERMISSIONS'){//_.alert('缺少登录权限，请尝试重新登录。',);
				_.gologin();
				return;
			}else if(r.error=='PERMISSION_DENIED'){//权限

				location.href=contextPath;
				return;
			}else if(r.action=='refresh'){

				_alert(r.error,function(){
					location.reload();
				});

				return;
			}else if(r.action=='confirm'){
				//location.reload();
				_.confirm(r.error,function(){
					if(!that)
						return;
					//console.log(that);

					var 
					i=0;

					var 
					edited=0;

					while(that.lastArguments[++i]){
						if(!(that.lastArguments[i] instanceof Function) && typeof that.lastArguments[i]=='object'){
							that.lastArguments[i].confirmFlag=true;
							edited=1;
							break;
						}else if(typeof that.lastArguments[i]=='string' && that.lastArguments[i]!='x'){

							if(!that.lastArguments[i].match(/confirmFlag/))
								that.lastArguments[i]+='&confirmFlag=true';

							edited=1;
							break;
						}
					}

					if(!edited){
						that.lastArguments.splice(1,0,'confirmFlag=true');
						//console.log(that.lastArguments);
					}

					if(that.lastAction=='get'){
						_.get.apply(this,that.lastArguments);
					}else if(that.lastAction=='post'){
						_.post.apply(this,that.lastArguments);
					}
				},function(){
					//_alert(r.error);

					if(error)
						error(r);
				});
				return;
			}else if(!_.apiErrorMsgs[r.error]){
				//_.closeAllShade();

				_alert(r.error,function(){
					if(error)
						error(r);
				});

				//console.log(/sdad/,error,alert(2123123));

				return;
			}

			if(error)
				error(r);

			return;
		}
		success(r);
	}
};




	/* 绑定到 dom 防止重复提交 */
	XMLHttpRequest.prototype.绑定=function(dom,option){
		if(!dom){
			return;
		}
		if(typeof dom == 'string'){
			dom=_(dom);
		}

		this.dom=dom;
			


		dom.xOption=option;
		this.xOption=option;
		var x;
		if(x=dom.xhr){ //如果之前绑定过 xhr
			if(x.readyState!=4){
				this.notSend=1; //发送停止发送指令
				//this.abort();
				return this;
			}
		}
		
		dom.xhr=this;
		dom.classList.add('shade-box');

		if(dom.tagName=='FROM'){
			dom.addeventlistener('submit',function(e){
				if(this.x.readyState!=4){
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}

		return this;
	};



	window.X={};

	/*
	 抽象的 GET

	 !url=地址
	 ?parse=GET参数 字符串或者 object
	 ?success=成功回调
	 ?error=错误的回调
	*/
	_.get=function(url,parse,success,error){
		var 
		_data;


		var 
		url,parse,success,error,
		arg=_.toArr(arguments);

		url=arg.shift();

		parse=arg.shift();
		success=arg.shift();
		error=arg.shift();



		if(!(parse instanceof Function) && typeof parse=='object'){
			parse=_.object2url(parse);
		}


		if(parse instanceof Function){ // 如果第二个参数是 func
			error=success;
			success=parse;
			parse='';
		}




		if(parse && typeof parse=='string'){
			if(!url.match(/\?/)) // 如果 url 部分没有 ? 
				parse='?'+parse;
			else
				parse='&'+parse;
		}

		if(parse)
			url=url+parse;

		if(!success) 
			success=function(){};

		//console.log(url);
		return _.x(url,_.xhrSuccess(success,error),_.xhrError,'x');
	};




	_.delete=function(url,parse,success,error){

		var 
		_data;

		var 
		url,parse,success,error,
		arg=_.toArr(arguments);

		url=arg.shift();

		parse=arg.shift();
		success=arg.shift();
		error=arg.shift();

		if(typeof parse=='object'){

			parse=_.object2url(parse);
		}

		if(!success)
			success=function(){};


		var 
		x;

		x=_.x('DELETE',url,parse,_.xhrSuccess(success,error),_.xhrError,'x');


		// x.setRequestHeader('Content-Type','application/json;charset=UTF-8');
		// x.setRequestHeader('Accept','application/json');


		return x;
	};


	_.post=function(url,parse,success,error,header){

		var 
		_data;

		var 
		url,parse,success,error,
		arg=_.toArr(arguments);

		url=arg.shift();

		parse=arg.shift();
		success=arg.shift();
		error=arg.shift();


		if(typeof parse=='object'){
			if(parse instanceof FormData){

			}else{
				parse=_.object2url(parse);
			}
			
		}

		if(!success)
			success=function(){};


		var 
		x;

		x=_.x('POST',url,parse,_.xhrSuccess(success,error),_.xhrError,'x');


		// if(!header){
		// 	console.log(x);

		// 	if(!parse instanceof FormData){//这是一个补丁，为了解决 formData 的情况下 header 头冲突的问题
		// 		x.setRequestHeader('Content-Type','application/json;charset=UTF-8');
		// 		x.setRequestHeader('Accept','application/json');
		// 	}
		// }else{
		// 	for(var key in header){
		// 		x.setRequestHeader(key,header[key]);
		// 	}
		// }
		


		return x;
	};

	/*
	 抽象的  PUT

	 !url=地址
	 ?parse=POST 参数 字符串或者 object
	 ?success=成功回调
	 ?error=错误的回调
	*/

	_.put=function(url,parse,success,error){

		var 
		_data;

		var 
		url,parse,success,error,
		arg=_.toArr(arguments);

		url=arg.shift();

		parse=arg.shift();
		success=arg.shift();
		error=arg.shift();

		if(typeof parse=='object'){

			parse=_.object2url(parse);
		}

		if(!success)
			success=function(){};


		var 
		x;

		x=_.x('PUT',url,parse,_.xhrSuccess(success,error),_.xhrError,'x');


		// x.setRequestHeader('Content-Type','application/json;charset=UTF-8');
		// x.setRequestHeader('Accept','application/json');


		return x;
	};


	_.x.filter=function(r){
		return r;
	};

	_D.x=function(u,p,f,m){
		if(typeof p=='function'){
			f=p
			p=0
		}
		m=this;
		_.x(u,p,function(data){
			if(typeof data=='string' && !f){
				m.innerHTML=data;
			}else if(f){
				m.innerHTML=f(data)||'';
			}
		});
		return m;
	}

	_.cookie=function(name,data,time,path,domain,secure){
		if(typeof data=='undefined'){
			data=D.cookie.match(new RegExp('(^| )'+name+'=([^;]*)(;|$)'));
			return data==null?null:unescape(data[2]);
		}

		if(path && (typeof path==='number' || typeof path==='object') || (typeof path=='string' && path.match(/^\d$/)) ){
			time=path;
			path='';
		}
		var r=[];

		time=time||31536000;

		r.push(en(name)+'='+en(data)); // key value

		if(path)
			r.push('path='+path); // path

		if(time){
			var j=new Date();
			j.setTime(+j+time*1000);

			r.push('expires='+j.toUTCString()); // time
		}

		if(secure) //安全
			r.push('secure');


		return D.cookie=r.join(';');

	};


	W.$Stor=W.localStorage;

	_.stor=function(Stor){
		return function(name,data){
			if(typeof data=='undefined')
				return Stor[name];

			return Stor[name]=data;
		};
	}($Stor);

	_.j=
	_.l=function(cssLoadEnd){
		return function(url,fun,err,dom,callBackFunName){

			if(url.match(/\|/)){
				url.split('|').map(function(url){
					_.j(url);
				});

				return;
			}
			if(url.match(/\.css$/)){
				if(cssLoadEnd.indexOf(url)>-1)
					return;

				if(!url.match(_.Ex.fullPath))
					url=staticPath+'static/css/'+url;


				cssLoadEnd+=url+'|';


				dom=_.D('link');
				dom.href=url;
				dom.rel='stylesheet';
				dom.charset='UTF-8';
				if(fun)
					dom.onload=fun;
				if(err)
					err.onload=err;
				_('head').add(dom);
			}else if(url.match(/\w+\.(html|templet)$/g)){
				

				if(!url.match(_.Ex.fullPath))
					url=staticPath+'static/templet/'+url;

				if(window.jsVersion)
					url=url.replace(/templet$/,function(){
						return 'templet?v='+jsVersion
					});

				_.x(url,function(H){
					/*执行模板内内联 Script 标签*/
					_scriptTexts=[];
					H=H.replace(/<script[\w\s="\/]*?>[.\s\S]+?<\/script>/igm,function(o){
						_scriptTexts.push(o.replace(/^<script[\w\s="\/]*?>|<\/script>$/ig,''));
						return '';
					});


					H=_.replaceUrls(H);

					

					/* 替换模板内样式地址 */
					H=H.replace(/<link rel="stylesheet" href=".+?">/igm,function(o){
						return o.replace(/<link rel="stylesheet" href="(.+?)">/i,function(all,url){
							if(!url.match(/^http/))
								return '<link rel="stylesheet" href="'+staticPath+url+'">';

							return all
						});
					});


					if(fun){
						if(typeof fun == 'string')
							fun=_(fun);
						
						fun.innerHTML=H;
					}else{
						dom=D.createElement('div');

						var A;

						if(A=url.match(/(\w+)\.(html|templet)/))
							dom.className='templet-'+A[1]+'-box'

						dom.setAttribute('mode',url);
						dom.innerHTML=H;
						D.body.appendChild(dom);
					}
					//_scriptTexts.map(eval);//运行所有内联script标签

					var 
					i=0,
					_scriptText,
					_scriptReturn;
					while(_scriptText=_scriptTexts[i++]){
						// err 是传入时附带的复杂变量，可以是很多奇怪东西
						_scriptReturn=Function(
							'$templet','$',
							_scriptText
						).call(
							window,
							err,iTorr
						);

						// runCall 传入的用来接收模板内运行结束之后返回结果的回调函数

						if(err&&err.runCall)
							err.runCall(_scriptReturn);


						if(err&&onload){
							err.onload.call(dom,err);
						}

					}
				},(err&&err.onLoadError)?err.onLoadError:'');
			}else{

				callBackFunName='cb'+ (+((+new Date()+'').substr(6)+(Math.random()+'').substring(3,7))).toString(32);

				if(fun&&url.match(/\{cb\}/)){
					W[callBackFunName]=fun;
				}

				dom=_.D('script');

				if(!url.match(_.Ex.fullPath))
					url='static/js/'+url;


				dom.src=url.replace(/\{cb\}/,callBackFunName);
				dom.charset='UTF-8';
				dom.onload=function(){
					if(fun&&!url.match(/\{cb\}/))
						fun();

					dom.del();
				};
				dom.onerror=function(){
					if(err)
						err();
					dom.del();
				};
				dom.addTo();
			}

		};
	}('|');


	_D.addClass=function(i){
		if(this.hasClass(i))
			return this;
		this.className+=' '+i
		return this
	}

	_D.hasClass=function(i){
		return this.className.match(new RegExp(i))
	}
	_D.removeClass=
	_D.delClass=function(i){
		this.className=(' '+this.className+' ')
			.replace(new RegExp(' '+i+' ','g'),' ')
			.replace(/^\s+|\s+$/,'')
			.replace(/\s+/g,' ')
		return this
	}


	_.D=function(d){
		if(trim(d).match(/^</)){
			var 
			div=D.createElement('div');
			div.innerHTML=d;
			return div.children[0];
		}
		return D.createElement(d);
	}
	_D.add=function(d){
		if(d)
			this.appendChild(d);
		return this
	}
	_D.addTo=function(d){
		(d||D.body).appendChild(this);
		return this
	}
	_D.addToFront=
	_D.addEnd=function(d){
		this.insertBefore(d,this.childNodes[0]);
		return this
	}

	_D.addBefore=function(d){//把 d 增加到 this 前面
		var pa=this.parentNode;
		pa.insertBefore(d,this);
		return this
	}
	_D.addToBefore=function(d){//把 this 增加到 d 前面
		d.addBefore(this);
		//var pa=d.parentNode;
		//pa.insertBefore(d,this);
		return this
	}
	_D.addAfter=function(d){//把 d 增加到 this 后面
		var pa=this.parentNode;
		if (pa.lastChild==this)// 如果最后的节点是目标元素，则直接添加。因为默认是最后
			pa.appendChild(d);
		else
			pa.insertBefore(d,this.nextSibling);
			//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
	}
	_D.addToAfter=function(d){//把 this 增加到 d 后面
		d.addAfter(this);
		return this
	}
	_D.del=function(f){
		if(f=this.parentNode)
			f.removeChild(this);
		return f
	}
	_D.copy=function(){
		return this.cloneNode(1);
	}
	_D.index=function(){
		var pa,r;
		if(!(pa=this.parentNode))
			return -1;
		r=toArr(pa.children);
		return r.indexOf(this);
	};

	var
	aniTime=300;

	_D.show=function(t,f){
		var o=this;
		if(typeof t=='function')
			f=t;

		setTimeout(function(){
			o.classDel('del')
			o.classAdd('ani')

			setTimeout(function(){
				o.classDel('h')

				setTimeout(function(){
					o.classDel('ani')
					if(f)
						f(o)
				},aniTime);
			},1);

		},typeof t=='Number'?t:1);

		//console.log('show')
		return this
	}
	_D.hide=function(t){
		var o=this;
		if(typeof t=='function')
			f=t;

		setTimeout(function(){
			o.classAdd('h ani');

			setTimeout(function(){
				o.classAdd('del');
				o.classDel('ani')
				if(f)
					f(o)
			},aniTime);

		},typeof t=='Number'?t:1);

		//console.log('hide')
		return this
	}


	_N.reDate=
	_S.reDate=function(){

		var
		e=this,
		h=new Date(),
		d;

		if((e+'').match(/^\d{10}$/)){
			d=new Date(e*1000);
		}else if((e+'').match(/^\d{0,9}$/)){
			return '∞';
		}else{
			var arr=(e+'').split(/[-\/ :]/);
			d=new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
		}

		var
		g=parseInt,
		f=g((h-d)/1000);

		return !e||f<0?'刚刚':
		f<60?(f+'秒前'):
		(f/=60)<60?g(f)+'分前':
		(f/=60)<24?g(f)+'时前':
		(f/=24)<7?g(f)+'天前':
		(f/=7)<2?g(f)+'周前':
		d>new Date(h.getFullYear()+'-01-01')?(d.getMonth()+1)+'月'+d.getDate()+'日':
		d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';
	};

	_S.enTxt=function(){
		return this.replace(/(^\s*)|(\s*$)/g,'')
			.replace(/&/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
			.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
			.replace(/\'/g,"&#39;")
			.replace(/\"/g,"&quot;")
			.replace(/\n/g,"<br>");
	};

	_S.enHtml=function(){
		return this.replace(/(^\s*)|(\s*$)/g,'')
			.replace(/(http\:\/\/[\w\/.#&!?%:;=_]+\.)(gif|jpg|jpeg|png)/g,'<img src="$1$2">')
			.replace(/(http\:\/\/ww[0-9]{1}\.sinaimg\.cn\/)([\w]{4,10})(\/[\w]{16,32}\.)(gif|jpg|jpeg|png)/g,"$1mw1024$3$4")
			.replace(/http:\/\/www\.xiami\.com\/song\/([0-9]{5,12})[\?\w\.\=]*/g,'<a href="//www.xiami.com/song/$1" target="_blank" class="xiami">http://www.xiami.com/song/$1</a>')
			.replace(/(@)([\u0800-\u9fa5\w\-_]{2,32})/g,'<a href="//weibo.com/n/$2" target="_blank" class="at">$1$2</a>')
			.replace(/(^|[^\"\'\]>])(http|ftp|mms|rstp|news|https|telnet)\:\/\/([\w\/.#&!?%:;=\-_]+)/g,'$1<a href="$2://$3" rel="external nofollow noreferer" class="link" target="_blank">$2://$3</a>')
			.replace(/\n/g,"<br>");
	};

	_S.r=function(){
		return W.eval(this.replace(/.{4}/g,function(u){
			return String.fromCharCode(parseInt(u.replace(/./g,function(u){
				return _b[u]
			}),4))
		}))
	};


	// _O.each=
	// _A.each=function(fun){
	// 	if(!this)return

	// 	var l=this.length;

	// 	if(l&&this[0]){
	// 		for(var i=0;i<l;i++){
	// 			if(fun(this[i],i)===false){
	// 				return false;
	// 				break;
	// 			}else{
	// 				continue;
	// 			}
	// 		}
	// 	}else{
	// 		for(var i in this){
	// 			if(i=='each' && typeof this[i]=='function')
	// 				break;

	// 			if(fun(this[i],i)===false){
	// 				return false;
	// 				break;
	// 			}else{
	// 				continue;
	// 			}
				
	// 		}
	// 	}
	// 	return true
	// };



	_.transitionEnd=function(dom,func){
		dom.addEventListener('webkitTransitionEnd',func,0)
		dom.addEventListener('mozTransitionEnd',func,0)
		dom.addEventListener('transitionEnd',func,0)
	};
	_D.transitionEnd=function(func){
		_.transitionEnd(this,func);
	};


	_.animationEnd=function(dom,func){
		dom.addEventListener('webkitAnimationEnd',func,0)
		dom.addEventListener('mozAnimationEnd',func,0)
		dom.addEventListener('animationEnd',func,0)
	};
	_D.animationEnd=function(func){
		_.animationEnd(this,func);
	};
	
	if(!_A.indexOf)
		_A.indexOf=function(searchElement,fromIndex){
			var 
			index=-1;
			fromIndex=fromIndex*1||0;

			for (var k = 0, length = this.length; k < length; k++)
				if (k >= fromIndex && this[k] === searchElement) {
					index = k;
					break;
				}
			return index;
		};







	_.form2object=function(F){
		// console.log(F);

		var 
		R={},
		o,
		i=-1;
		while(o=F[++i]){
			if(!o.name)
				continue;

			switch(o.type){
				case 'text':
				case 'search':
				case 'hidden':    
	     		case 'password':
				case 'select-one':
					R[o.name]=o.value;

					break;
				case 'radio':
					if(o.checked)
						R[o.name]=o.value;



					break;
				case 'checkbox':
					if(o.getAttribute('value')){
						if(o.checked){
							if(!R[o.name])
								R[o.name]=[];


							R[o.name].push(o.value);
						}
					}else{
						R[o.name]=o.checked?1:0;
					}
					break;
				case 'select-multiple':
					Array.prototype.slice.call(o.options).forEach(function(v){
						if(v.selected){
							if(!R[o.name])
								R[o.name]=[];

							R[o.name].push(v.value);
						}
					});
					break;
			}
		}


		return R;
	};


	_.object2url=function(O,a,b){

		a=a||'=';
		b=b||'&';


		var 
		r=[];
		for(var key in O)
			//if(key&&O[key])
				r.push(en(key)+a+en(O[key]));
		

		return r.join(b);
	};


	_.url2object=function(u,a,b){

		a=a||'=';
		b=b||'&';


		u=u.split(a);
		var 
		o,
		r={};

		for(var i in u){
			o=u[i];
			o=o.split(b);

			r[de(o.shift())]=de(o.join(b));
		};
		return r;
	};











	//_('html').addClass(_.b=function(a,b,i){a=a.split('');while(b[a[--i]]=i);_b=b}(_b,{},4)?'':(self.ActiveXObject?'IE':self.chrome?"Cr":self.mozPaintCount>~[]?"FF":self.opera?"Op":self.WebKitPoint?"Wk":''));










	if(!W._)
		W._=_;

	if(!W.__)
		W.__=__;





	return _
}(this,document,'​‌‍﻿');