var access_token = 'Bearer srTZBH+IqCX5K9wNsy027g==';
var nodes = [], links = [];
var q = [];

var deep = 2, range = 4

$(function () {
    $.ajax({
        type: 'GET',
        url: 'https://api.kkbox.com/v1.1/artists/-tZIG9TrdRktAwTLeG?territory=TW',
        headers: {
            'Authorization': access_token,
        },
        success: function (res) {
            addNode(res);
            addQueue(res, 0, deep);

            fetchArtistData();
        },
    });

    //drawRelatingGraph(graph);
    //node: {
    //  id: <int>
    //  name: <string>
    //  title: <string>
    //  group: <int>
    //}
    //link: {
    //  source: <int>
    //  target: <int>
    //  value: <int>
    //}
})

function fetchArtistData()
{
    var artist = q[0];
    q.shift();

    $.ajax({
        type: 'GET',
        url: 'https://api.kkbox.com/v1.1/artists/' + artist.id + '/related-artists?territory=TW&limit=' + range,
        headers: {
            'AUthorization': access_token
        },
        success: function(res) {
            for (var i = 0; i < res.data.length; ++i) {
                var data = res.data[i];
                var index = findArtist(data.id);

                if (artist.deep > 0 && index == -1) {
                    addNode(data);
                }

                target = findArtist(data.id);
                if (target != -1) {
                    addLink(artist, target);
                }

                if (artist.deep > 0 && target != -1) {
                    addQueue(data, target, artist.deep - 1);
                }
            }

            if (q.length == 0) {
                drawRelatingGraph({
                    nodes, 
                    links
                });
                return ;
            } else {
                fetchArtistData();
            }
        }
    });
}

function findArtist(id)
{
    for (var i = 0; i < nodes.length; ++i) {
        if (nodes[i].id == id) {
            return i;
        }
    }

    return -1;
}

function addNode(data, index)
{
    nodes.push({
        id: data.id,
        name: data.name,
        title: data.name,
        image: data.images[0],
        group: 0,
    });
}

function addLink(artist, target)
{
    links.push({
        source: artist.source,
        target: target,
        value: 2,
    });
}

function addQueue(data, target, deep)
{
    q.push({
        id: data.id,
        name: data.name,
        source: target,
        deep: deep,
    });
}
