Tag-Cloud-with-Dinamyc-Index-for-Blogger
========================================

Nube de etiquetas con lista dinámica de títulos de las entradas para Blogger

Documentación en: http://codementia.blogspot.com.es/2014/01/nube-de-etiquetas-con-indice-dinamico.html

Añadir el siguiente CSS y el cargador final a la página de Blogger:

<style>
#containerIdx
{
width: 90%;
margin-top: -30px;
margin-left: auto;
margin-right: auto;
}
#tagCloud
{
width: 100%;
font-family:"Times New Roman",Georgia,Serif;
text-align: center;
margin-bottom: 20px;
}
#tagCloud a // para no romper palabras al final del div
{
white-space: nowrap;
}
#listTitols
{
width: 100%;
text-align: center;
}
#dataPost
{
font-size: 12px;
}
</style>
<div id="containerIdx">
<div id="tagCloud" data-maxfont="250" data-minfont="100" linkColor="#000000" selectedLink="#666666" authorName="0" date="0" sort="1">
</div>
<div id="listTitols">
</div>
</div>

<script type="text/javascript" src="localización_script_TagCloudIndex.js">
</script>
<script src="http://host_de_tu_blog/feeds/posts/default?max-results=1000&amp;alt=json-in-script&amp;callback=cargaEtiquetas">
</script>
