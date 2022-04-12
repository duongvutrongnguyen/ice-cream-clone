const API = 'https://web1-api.herokuapp.com/api';
const AUTH_API = 'https://web1-api.herokuapp.com/users';
// const API = 'http://localhost:4000/api';
// const AUTH_API = 'http://localhost:4000/users';
Handlebars.registerHelper('formatDate', formatDate);

function formatDate(date) {
    let options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZoneName: 'short'
    };
    let str = (new Date(date)).toLocaleString("en-US", options);
    return str;
}


function loadDetails(request, targetId, source) {
    if (arguments.length == 1) {
        targetId = request;
        source = request;
    }
    $.ajax({
        url: `${API}/${request}`,
        cache: false,
        success: function(data) {
            let jsonData = {
                data: data
            };
            let target = $(`#${targetId}`);
            let template = Handlebars.templates[source];
            $(target).html(template(jsonData));
        }
    });
}

function search(keyword) {
    $('#content').addClass('container');
    $('#small-banner').css('visibility', 'visible');
    loadDetails(`search?keyword=${keyword}`, 'content', 'search-results');
    return false;
}

function loadData(type, id) {
    let template = 'aboutus-details';
    if (['blogs', 'gallery'].includes(type)) {
        template = `${type}-details`;
    } else if (['aboutus', 'team', 'visions', 'products'].includes(type)) {
        template = 'aboutus-details';
    }
    loadDetails(`${type}/${id}`, 'content', template);
}

function loadBlogById(id) {
    if ($('#blogs').length) {
        $('#blogs-pagination').html('');
        loadDetails(`blogs/${id}`, 'blogs', 'blogs-details');
    } else {
        loadDetails(`blogs/${id}`, 'content', 'blogs-details');
    }
}

function addComment() {
    $.ajax({
        url: `${AUTH_API}/authenticate`,
        type: 'POST',
        data: {
            username: 'test',
            password: '1c3cr3@m'
        },
        dataType: 'json',
        success: (data) => {
            localStorage.setItem('token', data.token);
        }
    });

    var formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        comment: $('#comment').val(),
        blogId: $('#blogId').val(),
        agree: $('#agree').prop('checked')
    };

    $.ajax({
        url: `${AUTH_API}/comment`,
        type: 'POST',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: formData,
        dataType: 'json',
        success: (data) => {
            //console.log(data.message);
            loadBlogById(formData.blogId);
        },
        error: function(xhr, status, error) {
            window.alert(error);
        }
    });

    return false;
}