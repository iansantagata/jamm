// Dependencies
var path = require('path'); // URI and local file paths

// Custom Modules
const customModulePath = __dirname;
var spotifyClient = require(path.join(customModulePath, 'spotifyClient.js'));

// Playlist Logic
exports.getPlaylistPage = async function(req, res, next)
{
    // Grab single playlist data that the user has requested
    try
    {
        var spotifyResponse = await spotifyClient.getSinglePlaylist(req, res);
    }
    catch (error)
    {
        next(error);
        return;
    }

    var playlistData = {
        playlistId: spotifyResponse.id,
        playlistName: spotifyResponse.name,
        playlistDescription: spotifyResponse.description,
        isCollaborative: spotifyResponse.collaborative,
        isPublic: spotifyResponse.public,
        followersCount: spotifyResponse.followers.total,
        trackCount: spotifyResponse.tracks.total,
        images: spotifyResponse.images,
        deleted: false
    };

    // Shove the playlist response data onto the playlist page for the user to interact with
    res.location('/playlist');
    res.render('viewPlaylist', playlistData);
};

exports.getAllPlaylistPage = async function(req, res, next)
{
    // Grab all playlist data from the user to show them on the home page in case they want to edit their playlists
    try
    {
        var spotifyResponse = await spotifyClient.getAllPlaylists(req, res);
    }
    catch (error)
    {
        next(error);
        return;
    }

    var numberOfPages = Math.ceil(spotifyResponse.total / spotifyResponse.limit);
    var currentPage = Math.floor((spotifyResponse.offset + spotifyResponse.limit) / spotifyResponse.limit);

    var playlistsPageData = {
        currentPage: currentPage,
        numberOfPages: numberOfPages,
        numberOfPlaylistsPerPage: spotifyResponse.limit,
        totalNumberOfPlaylists: spotifyResponse.total,
        playlists: spotifyResponse.items
    };

    // Shove the playlist response data onto the playlists page for the user to interact with
    res.render('viewPlaylists', playlistsPageData);
}

exports.deletePlaylistPage = async function(req, res, next)
{
    // Grab single playlist data that the user has requested, then delete the playlist
    try
    {
        var spotifyResponse = await spotifyClient.getSinglePlaylist(req, res);
        await spotifyClient.deleteSinglePlaylist(req, res);
    }
    catch (error)
    {
        next(error);
        return;
    }

    var playlistData = {
        playlistId: spotifyResponse.id,
        playlistName: spotifyResponse.name,
        playlistDescription: spotifyResponse.description,
        isCollaborative: spotifyResponse.collaborative,
        isPublic: spotifyResponse.public,
        followersCount: spotifyResponse.followers.total,
        trackCount: spotifyResponse.tracks.total,
        images: spotifyResponse.images,
        deleted: true
    };

    // Shove the playlist response data onto the home page for the user to interact with
    res.location('/playlist');
    res.render('viewPlaylist', playlistData);
}

exports.restorePlaylistPage = async function(req, res, next)
{
    // Restore the playlist that was previously deleted, then grab that single playlist data
    try
    {
        await spotifyClient.restoreSinglePlaylist(req, res);
        var spotifyResponse = await spotifyClient.getSinglePlaylist(req, res);
    }
    catch (error)
    {
        next(error);
        return;
    }

    var playlistData = {
        playlistId: spotifyResponse.id,
        playlistName: spotifyResponse.name,
        playlistDescription: spotifyResponse.description,
        isCollaborative: spotifyResponse.collaborative,
        isPublic: spotifyResponse.public,
        followersCount: spotifyResponse.followers.total,
        trackCount: spotifyResponse.tracks.total,
        images: spotifyResponse.images,
        deleted: false
    };

    // Shove the playlist response data onto the playlist page for the user to interact with
    res.location('/playlist');
    res.render('viewPlaylist', playlistData);
}

exports.createPlaylistPage = async function(req, res, next)
{
    // Simply show the user the page to create a new playlist
    res.location('/createPlaylist');
    res.render('createPlaylist');
}

exports.createPlaylist = async function(req, res, next)
{
    // Create a new playlist based on the user's request parameters
    try
    {
        // Only thing we do not have supplied from the user is their user ID
        // The app has to get their user ID first to attach this new playlist to their profile
        req.body.userId = await spotifyClient.getCurrentUserId(req, res);
        var spotifyResponse = await spotifyClient.createSinglePlaylist(req, res);
    }
    catch (error)
    {
        next(error);
        return;
    }

    var playlistData = {
        playlistId: spotifyResponse.id,
        playlistName: spotifyResponse.name,
        playlistDescription: spotifyResponse.description,
        isCollaborative: spotifyResponse.collaborative,
        isPublic: spotifyResponse.public,
        followersCount: spotifyResponse.followers.total,
        trackCount: spotifyResponse.tracks.total,
        images: spotifyResponse.images,
        deleted: false
    };

    // Shove the playlist response data onto the playlist page for the user to interact with
    res.location('/playlist');
    res.render('viewPlaylist', playlistData);
}

// TODO - Add endpoints as seen on buttons in playlist.vash page
