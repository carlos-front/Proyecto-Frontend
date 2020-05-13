<?php

// general config vars
$request = 'https://api.sendgrid.com/api/mail.send.json';
$user = 'azure_8f76ccfc41d7e352219fc865816b38c7@azure.com'; //PENDING
$pass = 'campusBS1'; // PENDING
$to = 'espaciodigital@bancsabadell.com'; // PENDING
$subject = 'Digitalitza’t creant un blog'; // PENDING
$from = 'bancsabadell@bancsabadell.com'; // PENDING
$logfile = 'sendmail.log';

// open logfile
$fp = fopen ($logfile, "w");

// logging
fwrite($fp, "[BEGIN EMAIL (" . date('Y-m-d H:i:s') .") ]\n");

// getting post vars
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $html = '<html><head></head></body>
<h2> Registre rebut de Digitalitza’t creant un blog:</h2>
<p> <strong>Nom:</strong> ' . htmlspecialchars($_POST["nombre"]) . '</p>
<p> <strong>Cognoms:</strong> ' . htmlspecialchars($_POST["apellidos"]) . '</p>
<p> <strong>NIF-NIE:</strong> ' . htmlspecialchars($_POST["dni"]) . '</p>
<p> <strong>Email:</strong> ' . htmlspecialchars($_POST["email"]) . '</p>
</body></html>';

    $text = "Registre rebut \nNom: " . $_POST["nombre"]
        . "\nCognoms: " . $_POST["apellidos"]
        . "\nNIF-NIE: " . $_POST["dni"]
        . "\nEmail: " . $_POST["email"];

    // logging
    fwrite($fp, "[BEGIN FORM]\n" . $text . "\n[END FORM]");

    // prepare sendgrid params
    $params = array(
    'api_user'  => $user,
    'api_key'   => $pass,
    'to'        => $to,
    'subject'   => $subject,
    'html'      => $html,
    'text'      => $text,
    'from'      => $from
    );

    // Generate curl request
    $session = curl_init($request);
    // Tell curl to use HTTP POST
    curl_setopt ($session, CURLOPT_POST, true);
    // Tell curl that this is the body of the POST
    curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
    // Tell curl not to return headers, but do return the response
    curl_setopt($session, CURLOPT_HEADER, false);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

    // Disable CURL SSL Requirement
    curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);

    // obtain response
    $response = curl_exec($session);

    curl_close($session);

    // print everything out
    fwrite($fp, "\n[SENDGRID RESPONSE]" . $response);

    header("Location: gracies.html");
}
else{
    //You could assume you got a GET
    fwrite($fp, "[ERROR]\n");
    header("Location: index.html");
}

fwrite($fp, "[END EMAIL (" . date('Y-m-d H:i:s') .") ]\n");
die();
