const agent = new XMLHttpRequest();
// export const API_ROOT = 'http://localhost:8083/api';
export const API_ROOT = 'http://194.67.90.172:8080';
const encode = encodeURIComponent;
const responseBody = res => res.body;

let hasCurrentUser = false;

let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        if (obj.url.indexOf("/setting") !== -1) {
            xhr.setRequestHeader("token", localStorage.getItem('jwtx'));
        }
        xhr.onload = () => {
            if (xhr.status === 401) {
                window.location.href = '/login';
                hasCurrentUser = false;
                localStorage.clear()
            }
            let responseHeader = xhr.getResponseHeader("token");
            if (!!responseHeader) {
                localStorage.setItem('jwtx', responseHeader);
                hasCurrentUser = true;
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                if (obj.url.indexOf("/auth") !== -1) {
                    window.location.href = '/';
                    resolve()
                }
                (obj && obj.method && obj.method === 'DELETE') ? resolve() :
                    (obj.method && (obj.method === 'POST' || obj.method === 'PUT')) ? resolve((xhr.response && xhr.response !== "") ? {body: JSON.parse(xhr.response)} : {}) :
                        !!obj.notJson ? resolve(xhr.response) : resolve(JSON.parse(xhr.response));
            } else {
                reject(JSON.parse(xhr.response));
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(JSON.stringify(obj.body));
    });
};


let rqFile = (url, file) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.file = file; // not necessary if you create scopes like this
        xhr.addEventListener('progress', function (e) {
            var done = e.position || e.loaded, total = e.totalSize || e.total;
            // console.log('xhr progress: ' + (Math.floor(done / total * 1000) / 10) + '%');
        }, false);

        if (xhr.upload) {
            xhr.upload.onprogress = function (e) {
                var done = e.position || e.loaded, total = e.totalSize || e.total;
                // console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
            };
        }
        xhr.onreadystatechange = function (e) {
            if (4 == this.readyState) {
                // console.log(['xhr upload complete', e]);
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.open('post', url, true);
        if (url.indexOf("/setting") !== -1) {
            xhr.setRequestHeader("token", localStorage.getItem('jwtx'));
        }
        // xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(file);
    });
};

const requests = {
    del: url =>
        request({url: `${API_ROOT}${url}`}).then(responseBody),
    get: (url, notJson) =>
        request({url: `${API_ROOT}${url}`, notJson: notJson})
            .then((responseBody) => {
                return responseBody;
            }).catch(er => {
            console.info(er);
            throw er
        }),
    put: (url, body) =>
        request({
            method: "PUT",
            url: `${API_ROOT}${url}`,
            body: body,
            headers: {"content-type": 'application/json'}
        }).then(responseBody),
    post: (url, body) =>
        request({
            method: "POST",
            url: `${API_ROOT}${url}`,
            body: body,
            headers: {'content-type': 'application/json'}
        }).then(responseBody),
    delete: (url) =>
        request({
            method: "DELETE",
            url: `${API_ROOT}${url}`
        }).then(() => {
        }),
    file: (url, body) =>
        rqFile(`${API_ROOT}${url}`, body)
};

const Auth = {
    login: (login, password) =>
        requests.post('/auth', {login, password}),
    hasUser: () => {
       return localStorage.getItem('jwtx')
    },
    logout: () => {
        localStorage.clear();
        hasCurrentUser = false;
    }
};

const Project = {
    save: (body) => requests.post('/setting/project', body),
    update: (body) => requests.put('/setting/project', body),
    getAll: () => requests.get('/getAllProject'),
    byGuid: (guid) => requests.get(`/getProject/${guid}`),
    changeOrder: (data) => requests.post('/setting/updateIndex', data),
};

const Price = {
    save: (body) => requests.post('/setting/price', body),
    getAll: () => requests.get('/getPrices'),
    delete: (id) => requests.delete(`/setting/price/${id}`)
};
const Order = {
    send: (data) => requests.post('/order', data)
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, {slug: undefined});

const Image = {
    get: id =>
        requests.get(`/image/${id}`, true),
    save: data =>
        requests.file(`/setting/file`, data),
    delete: guid =>
        requests.delete(`/setting/file/${guid}`),
};

const Windows = {
    all: page =>
        requests.get(`/setting/getWindows`),
    get: id =>
        requests.get(`/setting/element/${id}`),
    save: data =>
        requests.post(`/setting/element/${data.id}`, data),
    saveNew: data =>
        requests.post(`/setting/element`, data),
    saveFile: data =>
        requests.file(`/file`, data),
    deleteFile: data =>
        requests.delete(`/setting/image/${data}`),
};

const Elements = {
    all: data => {

        return requests.get(`/setting/getAll?type=${data}`)

    },

    get: id =>
        requests.get(`/setting/element/${id}`),
    save: data =>
        requests.post(`/setting/element/${data.id}`, data),
    saveNew: data =>
        requests.post(`/setting/element`, data),
};

const Doors = {
    get: id =>
        requests.get(`/setting/element/${id}`),
    save: data =>
        requests.post(`/setting/element/${data.id}`, data),
    saveFile: data =>
        requests.file(`/file`, data),
    deleteFile: data =>
        requests.delete(`/image/${data}`),
};

const Settings = {
    all: page =>
        requests.get(`/setting/getSettings`),
    save: data =>
        requests.post(`/setting/saveSetting`, data),
    getByKey: data =>
        requests.get(`/getSettingsByKeys?${data}`)
}

const Comments = {
    create: (slug, comment) =>
        requests.post(`/articles/${slug}/comments`, {comment}),
    delete: (slug, commentId) =>
        requests.del(`/articles/${slug}/comments/${commentId}`),
    forArticle: slug =>
        requests.get(`/articles/${slug}/comments`)
};

const Profile = {
    follow: username =>
        requests.post(`/profiles/${username}/follow`),
    get: username =>
        requests.get(`/profiles/${username}`),
    unfollow: username =>
        requests.del(`/profiles/${username}/follow`)
};

export default {
    Windows,
    Doors,
    Elements,
    Auth,
    Settings,
    Image,
    Price,
    Comments,
    Profile,
    Order,
    Project
};
