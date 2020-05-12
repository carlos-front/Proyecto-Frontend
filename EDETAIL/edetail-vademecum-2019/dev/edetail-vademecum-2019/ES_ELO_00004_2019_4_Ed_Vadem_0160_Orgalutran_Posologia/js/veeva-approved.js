/**
 * USAGE:
 *
 * 1/- With veeva-slides.js library
 *
 *      Directly call: com.usacd.approved.launchApprovedWindow( [Vault Ids], [Template Ids], [Array FragmentsId], [Language] );
 *      Example:
 *
 *        function launchApproved()
 *        {
 *            var aVaultID = {test: 'https://vv-agency-usacd.veevavault.com', prod: 'https://bi.veevavault.com'};
 *            var aTemplateID = {test: '282', prod: '3542'};
 *            var aFragmentsID = {test: ['278', '279'], prod: [2503, 2504]};
 *            com.usacd.approved.launchApprovedWindow(aVaultID, aTemplateID, aFragmentsID, 'es');
 *        }
 *        $.getElement('sendBtn').addEventListener($.EVENT_UP, launchApproved);
 *
 *
 * 2/- Without veeva-slides.js library
 *
 *      It is necessary to initialize the library first:  com.usacd.approved.init([Callback function]);
 *      Call after: com.usacd.approved.launchApprovedWindow( [Vault Ids], [Template Ids], [Array FragmentsId], [Language], [Callback function (Optional)] );
 *
 *      Example:
 *
 *      com.usacd.approved.init(function(){
 *          document.getElementById('sendBtn').addEventListener('touchend', function ()
 *          {
 *              var aVaultID = {test: 'https://vv-agency-usacd.veevavault.com', prod: 'https://bi.veevavault.com'};
 *              var aTemplateID = {test: '282', prod: '3542'};
 *              var aFragmentsID = {test: ['278', '279'], prod: [2503, 2504]};
 *              com.usacd.approved.launchApprovedWindow(aVaultID, aTemplateID, aFragmentsID, 'es');
 *         })
 *      });
 *
 */
var com = com || {};
com.usacd = com.usacd || {};

com.usacd.approved = (function () {

    var goApi = {};
    var msVersion = '2.0 r180718';
    var msEnvironment;
    var mbAccountsListAuto = false;
    var mbStagedDocuments = false;

    var miVaultId = '';
    var miTemplateId = '';
    var maFragments = [];
    var maFragmentIds = [];

    var miFragmentsLen = 0;
    var miCurrentFragment = 0;

    var msLanguage = 'es';
    var mfInitCallback;
    var mfLaunchCallback;
    var moNoAccountMessage =
    {
        es: 'Debes iniciar una visita para poder enviar un email.',
        it: 'Devi iniziare una visita per poter inviare un email.',
        en: 'You must start a visit to send an email',
        fr: 'Vous devez commencer une visite pour envoyer un email'
    };

    /**
     *
     * @param pfCallback
     */
    function init(pfCallback)
    {
        mfInitCallback = pfCallback;
        com.usacd.screenConsole = com.usacd.screenConsole || console;
        com.usacd.screenConsole.log('::com::usacd::approved::init - Version: ' + msVersion);
        getUserName();
    }

    function getUserName()
    {
        com.usacd.screenConsole.log('::com::usacd::approved::getUserName');
        com.veeva.clm.getDataForCurrentObject('User', 'Username', function(poResult)
        {
            if (poResult.success)
            {
                try
                {
                    com.veeva.clm.getDataForCurrentObject('User', 'Approved_Email_Admin_vod__c', function(poResult2)
                    {
                        if (poResult2.success && poResult2.User.Approved_Email_Admin_vod__c === "true")
                        {
                            mbStagedDocuments = true;
                        }
                        onUserGet(poResult.User.Username);
                    });
                }
                catch(poError){}
            }
            else
            {
                onUserGet(null);
            }
        });
    }

    function onUserGet(psUserName)
    {
        com.usacd.screenConsole.log('::com::usacd::approved::onUserGet - userName: ' + psUserName + '  - Can use Staged documents: ' + mbStagedDocuments);
        if(psUserName === null || psUserName.indexOf('@usacd') !== -1 || psUserName.indexOf('cloader@veeva') !== -1)
        {
            msEnvironment = 'test';
        }
        else
        {
            msEnvironment = 'prod';
        }
        com.usacd.screenConsole.log('::com::usacd::approved::onUserGet - msEnvironment: ' + msEnvironment);
        isSelectAccountAuto();
    }
    
    function isSelectAccountAuto()
    {
        com.usacd.screenConsole.log('::com::usacd::approved::isSelectAccountAuto');
        com.veeva.clm.queryRecord('Veeva_Settings_vod__c', 'CLM_SELECT_ACCOUNT_PREVIEW_MODE_vod__c ', '', [], '',  function(poResult)
            {
                if (poResult.success)
                {
                    if(poResult.Veeva_Settings_vod__c[0] && poResult.Veeva_Settings_vod__c[0].CLM_SELECT_ACCOUNT_PREVIEW_MODE_vod__c &&
                        (poResult.Veeva_Settings_vod__c[0].CLM_SELECT_ACCOUNT_PREVIEW_MODE_vod__c === 1 || poResult.Veeva_Settings_vod__c[0].CLM_SELECT_ACCOUNT_PREVIEW_MODE_vod__c === true))
                    {
                        mbAccountsListAuto = true;
                        com.usacd.screenConsole.log('::com::usacd::approved::isSelectAccountAuto - Result: true');
                    }
                    else
                    {
                        com.usacd.screenConsole.log('::com::usacd::approved::isSelectAccountAuto - Result: false');
                    }
                }
                else
                {
                    com.usacd.screenConsole.log('::com::usacd::approved::ísSelectAccountAuto - ERROR: ' + JSON.stringify(poResult ), 'error');
                }
                if(mfInitCallback) mfInitCallback();
            });
    }

    /**
     * @param {Object} poVaultId - {test: 'URL', prod: 'URL'}
     * @param {Object} poTemplateId - {test: 'Vault Id', prod: 'Vault Id'}
     * @param {Object} poFragmentsId - {test: [Vault Id, Vault Id,...], prod: [Vault Id, Vault Id,...]}
     * @param {String} [psLanguage=es] - es, it, en or fr
     * @param {function} pfCallback - Optional. Returns veeva callback object
     */
    function launchApprovedWindow(poVaultId, poTemplateId, poFragmentsId, psLanguage, pfCallback)
    {
        com.usacd.screenConsole.log('::com::usacd::approved::launchApprovedWindow');
        if(pfCallback) mfLaunchCallback = pfCallback;
        if(psLanguage) msLanguage = psLanguage;
        miVaultId = poVaultId[msEnvironment];
        maFragments = [];
        maFragmentIds = poFragmentsId[msEnvironment];
        miFragmentsLen = maFragmentIds.length;
        com.veeva.clm.getApprovedDocument(miVaultId, poTemplateId[msEnvironment], function (poResult)
        {
            com.usacd.screenConsole.log('::com::usacd::approved::launchApprovedWindow::getApprovedDocument - Result:');
            com.usacd.screenConsole.log(JSON.stringify(poResult));
            if ((poResult.success) && (poResult.Approved_Document_vod__c) && (poResult.Approved_Document_vod__c.ID))
            {
                miTemplateId = poResult.Approved_Document_vod__c.ID;
                com.usacd.screenConsole.log('::com::usacd::approved::launchApprovedWindow::getApprovedDocument - Template Id: ' + miTemplateId);
                miCurrentFragment = 0;
                loadFragments();
            }
            else
            {
                if(mbStagedDocuments)
                {
                    getStagedDocument(poTemplateId[msEnvironment], function (psId)
                    {
                        com.usacd.screenConsole.log('::com::usacd::approved::getStagedDocument - Template Id: ' + psId);
                        alert('WARNING: Template ' + psId + ' isn\'t Approved');
                        miTemplateId = psId;
                        miCurrentFragment = 0;
                        loadFragments();
                    });
                }
                else
                {
                    alert('::com::usacd::approved::launchApprovedWindow - ERROR: Template "' + poTemplateId[msEnvironment] + '" not available.');
                    loadFragments();
                }
            }
        });
    }

    function loadFragments()
    {
        if(miCurrentFragment < miFragmentsLen)
        {
            com.veeva.clm.getApprovedDocument(miVaultId, maFragmentIds[miCurrentFragment], fragmentLoaded);
        }
        else
        {
            launchApprovedEmail();
        }
    }

    function fragmentLoaded(poResult)
    {
        if ((poResult.success) && (poResult.Approved_Document_vod__c) && (poResult.Approved_Document_vod__c.ID))
        {
            maFragments.push(poResult.Approved_Document_vod__c.ID);
            com.usacd.screenConsole.log('::com::usacd::approved::fragmentLoaded - Fragment Id: ' + poResult.Approved_Document_vod__c.ID);
            miCurrentFragment++;
            loadFragments();
        }
        else
        {
            if(mbStagedDocuments)
            {
                getStagedDocument(maFragmentIds[miCurrentFragment], function (psId)
                {
                    com.usacd.screenConsole.log('::com::usacd::approved::getStagedDocument - Fragment Id: ' + psId);
                    alert('WARNING: Fragment ' + psId + ' isn\'t Approved');
                    maFragments.push(psId);
                    miCurrentFragment++;
                    loadFragments();
                })
            }
            else
            {
                alert('::com::usacd::approved::fragmentLoaded - ERROR: Fragment "' + maFragmentIds[miCurrentFragment] + '" not available.');
                miCurrentFragment++;
                loadFragments();
            }
        }
    }

    function getStagedDocument(piDocumentId, pfCallback)
    {
        com.usacd.screenConsole.log('::com::usacd::approved::getStagedDocument');
        var sWhere = 'Vault_Document_ID_vod__c="' + piDocumentId + '" AND Status_vod__c="Staged_vod" AND Vault_Instance_ID_vod__c="' + miVaultId + '"';
        com.veeva.clm.queryRecord('Approved_Document_vod__c', 'Id,Status_vod__c,Vault_Document_ID_vod__c,Vault_Instance_ID_vod__c', sWhere, [], '',  function(poResult)
        {
            com.usacd.screenConsole.log('::com::usacd::approved::launchApprovedWindow::getStagedDocument - Result:');
            com.usacd.screenConsole.log(JSON.stringify(poResult));
            if (poResult.success)
            {
                pfCallback(poResult.Approved_Document_vod__c[0].Id)
            }
            else
            {
                com.usacd.screenConsole.log('::com::usacd::approved::getStagedDocument - ERROR: ' + JSON.stringify(poResult ), 'error');
            }
        });
    }

    function launchApprovedEmail()
    {
        com.veeva.clm.launchApprovedEmail(miTemplateId, maFragments, function (e)
        {
            if(mfLaunchCallback)
            {
                mfLaunchCallback(e);
                mfInitCallback = null;
            }
            else if (!e.success && !mbAccountsListAuto)
            {
                alert(moNoAccountMessage[msLanguage]);
            }
        });
    }

    addEventListener("veevaSlidesReady", function () {
        init();
    });

    /**
     * Externally initializing (In case of not using veeva-slides.js)
     * @param {Function} pfCallback
     */
    goApi.init = init;
    /**
     * @param {Object} poVaultId - {test: 'URL', prod: 'URL'}
     * @param {Object} poTemplateId - {test: 'Vault Id', prod: 'Vault Id'}
     * @param {Object} poFragmentsId - {test: [Vault Id, Vault Id,...], prod: [Vault Id, Vault Id,...]}
     * @param {String} [psLanguage=es] - es, it, en or fr
     */
    goApi.launchApprovedWindow = launchApprovedWindow;
    return goApi;
}());
