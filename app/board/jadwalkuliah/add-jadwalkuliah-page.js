const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, items_hari = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

function resetForm() {
    context.set("dosenSelectedIndex", undefined);
    context.set("ruanganSelectedIndex", undefined);
    context.set("matakuliahSelectedIndex", undefined);
    context.set("hariSelectedIndex", undefined);
    context.set("start_time", "");
    context.set("start_date", "");
    context.set("end_time", "");
    context.set("end_date", "");
}

function getDosen() {
    GModel.dosen("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].u_id);
            elval.push(data[i].u_fullname);
        }
        context.set("elid_dosen", elid);
        context.set("elval_dosen", elval);
        xLoading.hide();
    });
}

function getMatakuliah() {
    GModel.matakuliah("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].mk_id);
            elval.push(data[i].mk_name);
        }
        context.set("elid_matakuliah", elid);
        context.set("elval_matakuliah", elval);
        xLoading.hide();
    });
}

function getRuangan() {
    GModel.ruangan("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].r_id);
            elval.push(data[i].r_name);
        }
        context.set("elid_ruangan", elid);
        context.set("elval_ruangan", elval);
        xLoading.hide();
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        getDosen();
        getMatakuliah();
        getRuangan();
        resetForm();
        context.set("items_hari", items_hari);
    }, gConfig.timeloader);
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GModel;

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/jadwalkuliah/list-jadwalkuliah-page",
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};

exports.save = function() {
    let data = context;

    if (data.dosenSelectedIndex == undefined && data.ruanganSelectedIndex == undefined && data.matakuliahSelectedIndex == undefined && data.hariSelectedIndex == undefined && data.start_time == undefined && data.end_time && data.start_date && data.end_date == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.dosenSelectedIndex == "" && data.ruanganSelectedIndex == "" && data.matakuliahSelectedIndex == "" && data.hariSelectedIndex == "" && data.start_time == "" && data.end_time && data.start_date && data.end_date == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        dosen: data.elid_dosen[data.dosenSelectedIndex],
        ruangan: data.elid_ruangan[data.ruanganSelectedIndex],
        matakuliah: data.elid_matakuliah[data.matakuliahSelectedIndex],
        day: data.items_hari[data.hariSelectedIndex],
        start_kuliah: data.start_time,
        end_kuliah: data.end_time,
        active_from: data.start_date,
        active_until: data.end_date,
    };

    xLoading.show(gConfig.loadingOption);
    GModel.jadwalkuliah("add", params).then(function(result) {
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/jadwalkuliah/list-jadwalkuliah-page",
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
            resetForm();
        } else {
            toastModule.makeText(result.message).show();
        }
        xLoading.hide();
    });
};