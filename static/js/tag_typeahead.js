var typeahedList = document.getElementsByClassName('typeahead');
var searchTag = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('q'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
    url: '/user/search_tag_typeahead?q=%QUERY',
    wildcard: '%QUERY'
    }
});
$(document).on('keyup', '.typeahead', function(e){
    $(this).typeahead({
        //hint:true,
        //highlight: true,
        autoselect: true,
        minLength:2,
        limit: 10,
    }, {
        name: 'searchTag',
        displayKey: 'q',
        source: searchTag,
        templates:{
        empty: 'Не має в базі',
        }
    });
    $(this).focus();  
});