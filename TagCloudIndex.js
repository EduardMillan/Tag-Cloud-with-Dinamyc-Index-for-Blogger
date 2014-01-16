/**********************
*
*	Nube de etiquetas con índice dinámico para Blogger
*
*	Eduard Millán Forn 2014
*	http://codementia.blogspot.com.es/
*
***********************/

var lastLink = null;
var linkColor = '#000000', selectedLink = '#000000';
var showAuthor = true;
var showDate = true;

function gestionaColorLink(alink)
//	Cambia el color de la etiqueta seleccionada y devuelve su color a la anterior
{
	if (!(lastLink === null))
		lastLink.style.color = linkColor;
	lastLink = alink;
	alink.style.color = selectedLink;
}

var MonthNames = ['Enero', 'Febrero', 'Marzo', 'Abril' , 'Mayo', 'Juny', 'Julio' , 'Agosto', 'Septiembre', 'Octubre' , 'Noviembre' , 'Diciembre'];

function loadPosts(label, alink)
//	Cargamos el feed de los posts del tema (label) seleccionado
{
	gestionaColorLink(alink);
	iframe = document.getElementById('listTitols');

	if (window.XMLHttpRequest)
	{	// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}
	else
  	{	// code for IE6, IE5
  		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
  	}
	xmlhttp.open('GET', 'http://' + window.location.host + '/feeds/posts/summary/-/' + label, false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML; 

	iframe.innerHTML = '';

	var x = xmlDoc.getElementsByTagName('entry');
	for(var i = 0; i <= x.length - 1; i++)	//	Obtenemos la URL
	{
		urls = x[i].getElementsByTagName('link');
		ThisPostURL = '';
	    for(LinkNum = 0; LinkNum < urls.length; LinkNum++) 
	    {
			if (urls[LinkNum].getAttribute('rel') == 'alternate') 
			{
			    ThisPostURL = urls[LinkNum].getAttribute('href');
		    	break;
			}
	    }
		nomautor = '';
		if (showAuthor)	//	Obtenemos el nombre del autor
		{
			autor = x[i].getElementsByTagName('author');
			nomautor = autor[0].getElementsByTagName('name')[0].childNodes[0].nodeValue + ', ';
		}
		public = '';
		if (showDate)	//	Obtenemos la fecha de publicación
		{
			data = x[i].getElementsByTagName('published')[0].childNodes[0].nodeValue;
			public = data.substring(8,10) + ' ' + MonthNames[parseInt(data.substring(5,7), 10) - 1] + ' ' + data.substring(0,4);
		}
		iframe.innerHTML += '<a href="' + ThisPostURL + '">' + x[i].getElementsByTagName('title')[0].childNodes[0].nodeValue + '</a>' + ((showAuthor || showDate) ? '&nbsp;&nbsp;&nbsp;<span id="dataPost">(' + nomautor + public + ')</span>' : '');
		iframe.innerHTML += '<br/>';		
	}
}

var listaEtiquetas = new Array();	//	Array bidimensional: [etiqueta, peso]

function generaCloud()
//	Generación de la nube de etiquetas
{
	var tc = document.getElementById('tagCloud');
   	var minPercent = parseInt(tc.getAttribute('data-minfont'), 10);
   	var maxPercent = parseInt(tc.getAttribute('data-maxfont'), 10);
	var ordena = (tc.getAttribute('sort') == '1');
	var vmax = 1, vmin = 999;

	linkColor = tc.getAttribute('linkColor');
	selectedLink = tc.getAttribute('selectedLink');
	showAuthor = (tc.getAttribute('authorName') == '1');
	showDate = (tc.getAttribute('date') == '1');
	if (ordena)
	{
		listaEtiquetas = listaEtiquetas.sort(function(a,b) {
			s1 = a[0].toLowerCase();
			s2 = b[0].toLowerCase();
			return ((s1 < s2) ? -1 : (s1 > s2) ? 1 : 0); });
	}
	for (idx = 0; idx < listaEtiquetas.length; idx++)
	{
		data = listaEtiquetas[idx][1];
		vmax = (data > vmax ? data : vmax);  
		vmin = (vmin > data ? data : vmin);
	}
	multiplier = (maxPercent - minPercent) / (vmax - vmin); 
	
	while (tc.hasChildNodes())
	    tc.removeChild(tc.lastChild);
	for (idx = 0; idx < listaEtiquetas.length; idx++)
	{
		a = document.createElement('a');
		a.setAttribute('href', '#');
		a.setAttribute('onclick', 'loadPosts("' + listaEtiquetas[idx][0] + '", this)');
		a.innerHTML = listaEtiquetas[idx][0];
		a.style.fontSize = (minPercent + ((vmax - (vmax - (listaEtiquetas[idx][1] - vmin))) * multiplier)).toString() + '%';
		a.style.color = linkColor;
		tc.appendChild(a);
		espai = document.createTextNode('\u00A0');	//	No usar ' ', al recargar página desaparece
		tc.appendChild(espai);
	}
}

function contarEtiquetas(label)
//	Añadimos la etiqueta (label) a la lista si no está o incrementamos su peso si ya existe
{
	cnt = 0;
	ok = false;
	while ((cnt < listaEtiquetas.length) && (!ok))
	{
		ok = (listaEtiquetas[cnt][0] === label);
		if (!ok) cnt++;
	}
	if (ok)
		listaEtiquetas[cnt][1]++;
	else
		listaEtiquetas.push([label, 1]);
}

function cargaEtiquetas(TotalFeed) // <---- Entry point
{
	if ('entry' in TotalFeed.feed)	
	{
		var PostEntries = TotalFeed.feed.entry.length;
		var PostNum = 0;
		for(; PostNum < PostEntries; PostNum++) 
		{
			ThisPost = TotalFeed.feed.entry[PostNum];
			label = ThisPost.category;
    	    for (i = 0; i < label.length; i++)
				contarEtiquetas(label[i].term);
		}
		if (PostNum > 0) generaCloud();
    }
}
