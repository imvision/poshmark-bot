// ==UserScript==
// @name         Poshmark sharing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate sharing on poshmark
// @author       Alphanon
// @match        https://poshmark.com/*
// ==/UserScript==

(function() {
    'use strict';

    let base_url = document.location.origin;

    let pathname = document.location.pathname;

    let countItemsToShare = 4;

    let countItemsShared = 0;

    let categories = ['Women', 'Men', 'Kids'];

    if (pathname === '/feed')
    {
        browseCategory(categories[0]);
    }
    else if (pathname.includes('/category'))
    {
        execCategoryAction();
    }

    function browseCategory(categoryTitle)
    {
        console.log('moving to: /' + categoryTitle);
        document.location.href = base_url + '/category/' + categoryTitle;
        // document.querySelector( "a[href='/category/" + categoryTitle + "']").click();
    }

    function execCategoryAction()
    {
        let path_ar = document.location.pathname.split('/');

        let categoryTitle = path_ar[2];

        ++countItemsShared;
        console.log('countItemsShared ' + countItemsShared);
        if (countItemsShared <= countItemsToShare) {
            setTimeout(clickShare, 1500, countItemsShared);
        } else {
            let catIndex = getCurrentCategoryIndex(categoryTitle);

            if (catIndex < (categories.length - 1)) {

                browseCategory(getNextCategory([catIndex+1]));
            }
        }
    }

    function getNextCategory(index)
    {
        return categories[index];
    }

    function clickShare(itemIndex)
    {
        document.querySelector('#tiles-con .col-x12:nth-of-type('+itemIndex+') .social-info > ul > li:nth-of-type(3) > a').click();

        setTimeout(clickShareToMyFollowers, 1500);
    }

    function clickShareToMyFollowers()
    {
        document.querySelector('.internal-shares > li > a').click();
        setTimeout(shareToMyFollowersCompleted, 1000, []);
        // let shareUrl = base_url + document.querySelector('.internal-shares > li > a').getAttribute('href');

        /*GM_xmlhttpRequest({
            method: 'POST',
            url: shareUrl,
            onload: shareToMyFollowersCompleted,
            onerror: shareToMyFollowersFailed
        });*/
    }

     function shareToMyFollowersCompleted(data)
     {
         console.log(data);
         closeModal();
         execCategoryAction();
     }

     function shareToMyFollowersFailed()
     {
         console.log('share request failed with error!');
         closeModal();
         execCategoryAction();
     }

    function closeModal()
    {
        document.querySelector('.modal .close').click();
    }

    function getCurrentCategoryIndex(categoryTitle)
    {
        return categories.findIndex(function(item) { return item === categoryTitle; })
    }
})();
