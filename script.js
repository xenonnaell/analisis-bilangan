const ROOT = "√";

let real = [];
let imag = [];

function tambah(arr, c, r) {
    if (Math.abs(c) < 1e-9) return;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].r === r) {
            arr[i].c += c;

            if (Math.abs(arr[i].c) < 1e-9) {
                arr.splice(i, 1);
            }

            return;
        }
    }

    arr.push({ c: c, r: r });
}

function akarSederhana(n, c) {
    n = Math.abs(n);

    let luar = 1;

    for (let i = 2; i * i <= n; i++) {
        while (n % (i * i) === 0) {
            luar *= i;
            n /= i * i;
        }
    }

    return {
        c: c * luar,
        r: n
    };
}

function bacaSuku(token) {
    if (!token) return;

    let s = token;
    let minus = false;
    let im = false;
    let c = 1;
    let r = 1;

    if (s[0] === "+" || s[0] === "-") {
        minus = s[0] === "-";
        s = s.substring(1);
    }

    if (!s) return;

    if (s[0] === ROOT) {
        s = s.substring(1);

        let negatif = false;

        if (s[0] === "-") {
            negatif = true;
            s = s.substring(1);
            im = true;
        }

        let angka = s.match(/^\d+/);

        if (!angka) return;

        let x = parseInt(angka[0]);

        let hasil = akarSederhana(x, 1);
        c = hasil.c;
        r = hasil.r;

        if (negatif) {
            im = true;
        }
    }

    else if (s === "i") {
        im = true;
    }

    else {
        let angka = s.match(/^\d+(\.\d+)?/);

        if (!angka) return;

        c = parseFloat(angka[0]);
        s = s.substring(angka[0].length);

        if (s === "i") {
            im = true;
        }

        else if (s[0] === ROOT) {
            s = s.substring(1);

            let negatif = false;

            if (s[0] === "-") {
                negatif = true;
                s = s.substring(1);
                im = true;
            }

            let nilai = s.match(/^\d+/);

            if (!nilai) return;

            let x = parseInt(nilai[0]);

            let hasil = akarSederhana(x, c);

            c = hasil.c;
            r = hasil.r;

            if (negatif) {
                im = true;
            }
        }
    }

    if (minus) {
        c = -c;
    }

    tambah(im ? imag : real, c, r);
}

function proses(input) {
    real = [];
    imag = [];

    input = input
        .replace(/\s/g, "")
        .replace(/−/g, "-");

    let token = "";
    let i = 0;

    while (i < input.length) {
        let ch = input[i];

        if ((ch === "+" || ch === "-") && token.length > 0) {

            if (ch === "-" && token[token.length - 1] === ROOT) {
                token += ch;
            } else {
                bacaSuku(token);
                token = ch;
            }
        }

        else {
            token += ch;
        }

        i++;
    }

    bacaSuku(token);
}

function formatAngka(x) {
    if (Math.abs(x - Math.round(x)) < 1e-9) {
        return Math.round(x).toString();
    }

    return x.toFixed(2);
}

function tampil(arr) {
    if (arr.length === 0) {
        return "0";
    }

    let hasil = "";

    for (let i = 0; i < arr.length; i++) {
        let c = arr[i].c;
        let r = arr[i].r;

        if (i > 0) {
            if (c < 0) {
                hasil += " - ";
                c = Math.abs(c);
            } else {
                hasil += " + ";
            }
        }

        else if (c < 0) {
            hasil += "-";
            c = Math.abs(c);
        }

        if (r === 1) {
            hasil += formatAngka(c);
        }

        else {
            if (Math.abs(c - 1) > 1e-9) {
                hasil += formatAngka(c);
            }

            hasil += ROOT + r;
        }
    }

    return hasil;
}

function tampilImajiner(arr) {
    if (arr.length === 0) {
        return "0i";
    }

    return tampil(arr) + "i";
}

function bentukStandar() {
    let r = tampil(real);

    if (imag.length === 0) {
        return r + " + 0i";
    }

    let im = tampil(imag);

    if (real.length === 0) {
        return "0 + " + im + "i";
    }

    return r + " + (" + im + ")i";
}

function jenisBilangan() {
    if (real.length === 0 && imag.length === 0) {
        return "Bilangan Nol";
    }

    if (imag.length === 0) {
        return "Bilangan Real";
    }

    if (real.length === 0) {
        return "Bilangan Imajiner Murni";
    }

    return "Bilangan Kompleks";
}

function analisis() {
    let input = document.getElementById("inputBilangan").value.trim();

    if (input === "") {
        alert("Masukkan bilangan terlebih dahulu!");
        return;
    }

    proses(input);

    document.getElementById("standar").textContent = bentukStandar();
    document.getElementById("real").textContent = tampil(real);
    document.getElementById("imaginer").textContent = tampilImajiner(imag);
    document.getElementById("jenis").textContent = jenisBilangan();
}

function isiContoh(teks) {
    document.getElementById("inputBilangan").value = teks;
    analisis();
}

document
    .getElementById("inputBilangan")
    .addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            analisis();
        }
    });
