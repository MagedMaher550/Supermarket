# import the necessary packages
import urllib.request
import sys
import json
import operator
import numpy as np
import cv2
import imutils
from keras.models import Sequential

class ColorDescriptor:

    def describe(self, image):

        image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # create SIFT feature extractor
        sift = cv2.xfeatures2d.SIFT_create()
        keypoints, descriptors = sift.detectAndCompute(image, None)
        pooling=Sequential([MaxPooling2D(pool_size = 2, strides = 2)])
        maxPooling=pooling.predict(image)
        return maxPooling



dataset = json.loads(sys.argv[1])
inputImage = json.loads(sys.argv[2])


def getUrlImgMtx(url):

    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1)
    return img

def indexFunction(dataset): 
    
    cd = ColorDescriptor()
    results = []
    for inputImage in range(len(dataset)):
        image = getUrlImgMtx(dataset[inputImage])
        features = cd.describe(image)
        results.append({"image": dataset[inputImage],"features": features})
    return results

def chi2_distance(A, B):
    # compute the chi-squared distance using above formula
    chi = 0.5 * np.sum([((a - b) ** 2) / (a + b) if a+b != 0 else 0
                      for (a, b) in zip(A, B)])
    return chi

def search(indexResults, queryFeatures, limit = 10):
    # initialize our dictionary of results
    results = []
    # open the index file for reading
    # initialize the CSV reader
    # loop over the rows in the index
    images = []
    queryFeature = [float(x) for x in queryFeatures[0]["features"]]

    for i in range (len(indexResults)):
        images.append(indexResults[i]["image"])
    
    count = 0
    for indexFeature in indexResults:

        feature = [float(x) for x in indexFeature["features"]] 
        d = chi2_distance(feature, queryFeature)

        results.append({
            "image": images[count],
            'd': d
        })  
        count = count + 1
        # close the reader
    # sort our results, so that the smaller distances (i.e. the
    # more relevant images are at the front of the list)
    # results = sorted([(v, k) for (k, v) in results.items()])
    # return our (limited) results
    results.sort(key=operator.itemgetter('d'), reverse=False)
    return results[:limit]

print(json.dumps(search(indexFunction(dataset),indexFunction([inputImage]), limit=3)))












def MaxPooling2D(A,B):
    # compute the chi-squared distance using above formula
    chi = 0.5 * np.sum([((a - b) ** 2) / (a + b) if a+b != 0 else 0
                      for (a, b) in zip(A, B)])
    return chi
