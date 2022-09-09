import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import got from 'got';
import {
    fileTypeFromStream
} from 'file-type';

const moralisApiKey = process.env.moralisApiKey

const fetchNFTs = async (address) => {
    let metadataObjects = await fetchRawMetadata(address);
    let normalizedMetadata = await fetchNormalizedMetadata(metadataObjects);
    // filter out invalid contentTypes
    let filteredMetadata = filterMetadata(normalizedMetadata)
    let sortedMetadata = sortMetadata(filteredMetadata)
    return sortedMetadata;
}

const fetchRawMetadata = async (address) => {
    try {
        let url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=eth&format=decimal`
        const options = {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'X-API-Key': `${moralisApiKey}`
            }
        };

        const nfts = await fetch(url, options)
            .then((response) => response.json())
            .then((response) => {
                return response.result;
            })
            .catch(err => {
                console.error(err)
            });

        if (nfts === undefined)
            return

        let metadataObjects = [];

        nfts.forEach(function(nft) {
            let json = JSON.parse(nft.metadata)
            if (json !== null) {
                const name = (json.name !== undefined) ? json.name : `${nft.name} #${nft.token_id}`
                const tokenName = (nft.name !== null) ? nft.name : name
                const image = (json.animation_url !== undefined) ?
                    json.animation_url :
                    (json.image_url !== undefined) ?
                    json.image_url :
                    json.image
                let object = {
                    name: `${name}`,
                    tokenName: `${tokenName}`,
                    tokenID: `${nft.token_id}`,
                    image: `${image}`,
                    contractAddress: `${nft.token_address}`,
                };
                metadataObjects.push(object)
            }
        })

        return metadataObjects;
    } catch (error) {
        throw error;
    }
}

const filterMetadata = (metadata) => {
    let validContentTypes = [
        "image/png",
        "image/gif",
        "image/svg+xml",
        "image/jpeg",
        "video/mp4",
    ];

    let filteredMetadata = metadata.filter((data) => {
        return validContentTypes.includes(data.contentType);
    });
    return filteredMetadata;
}

const sortMetadata = (metadata) => {
    metadata.sort(function(a, b) {
        return a.contractAddress.localeCompare(b.contractAddress);
    });
    return metadata;
}

const updateURI = (uri) => {
    let updatedURI = uri;
    if (updatedURI.startsWith("ipfs://")) {
        updatedURI = `https://ipfs.io/ipfs/${updatedURI.split("ipfs://")[1]}`;
    }
    // updatedURI = `https://cors-anywhere.herokuapp.com/${updatedURI}`
    return updatedURI;
};

const fetchWithTimeout = async (resource, options = {}) => {
    const {
        timeout = 10000
    } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

const getContentTypeFromStream = async (uri) => {
    try {
        const stream = got.stream(uri);
        const response = await fileTypeFromStream(stream)
        if (response === undefined)
            return undefined;
        const contentType = response.mime
        return contentType;
    } catch (error) {
        console.error(`error.url - ${error.url}`)
        console.error(`error.statusCode - ${error.statusCode}`)
        console.error(`error.statusMessage - ${error.statusMessage}`)
    }
}

const getContentTypeFromHeader = async (uri) => {
    let contentType = fetchWithTimeout(uri, {
            timeout: 3000
        })
        .then((response) => {
            return response.blob().then((blob) => {
                return {
                    contentType: response.headers.get("Content-Type"),
                    raw: blob,
                };
            });
        })
        .then((data) => {
            return data.contentType;
        })
        .catch((error) => {
            console.error(error)
        });
    return contentType;
}

const fetchNormalizedMetadata = (metadataObjects) => {
    return Promise.all(
        metadataObjects.map(async function(obj) {
            let updatedImage = updateURI(obj.image);
            obj.image = updatedImage;
            let contentType = await getContentTypeFromStream(updatedImage)
            if (contentType === undefined) {
                contentType = await getContentTypeFromHeader(updatedImage)
            }

            let metadataObject = {
                url: `${obj.image}`,
                name: `${obj.name}`,
                contentType: `${contentType}`,
                tokenID: `${obj.tokenID}`,
                tokenName: `${obj.tokenName}`,
                contractAddress: `${obj.contractAddress}`,
            };

            return metadataObject;
        })
    );
}

export default fetchNFTs;