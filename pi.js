Pi.init({ version: "2.0" });

function continueWithPi() {
    Pi.createPayment({
        amount: 0.01,
        memo: "Continuar Flappy Pi",
        metadata: { action: "continue" }
    }, {
        onReadyForServerCompletion: function () {
            reviveGame();
        },
        onCancel: function () {
            console.log("Pagamento cancelado");
        },
        onError: function (err) {
            console.error(err);
        }
    });
}
