# import the necessary packages
import urllib.request
import sys
import json
import operator
import numpy as np
import cv2
import imutils

class ColorDescriptor:
    def __init__(self, bins):
		# store the number of bins for the 3D histogram
        self.bins = bins
    def describe(self, image):
		# convert the image to the HSV color space and initialize
		# the features used to quantify the image
        # np.zeros((1200,200))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        # try:
        #     image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
        # except:
        #     image = cv2.cvtColor(np.zeros((1200,300,3), np.uint8), cv2.COLOR_BGR2HSV)
            
        image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        features = []
        # grab the dimensions and compute the center of the image
        (h, w) = image.shape[:2]
        (cX, cY) = (int(w * 0.5), int(h * 0.5))

        # divide the image into four rectangles/segments (top-left,
        # top-right, bottom-right, bottom-left)
        segments = [(0, cX, 0, cY), (cX, w, 0, cY), (cX, w, cY, h),(0, cX, cY, h)]
        # construct an elliptical mask representing the center of the
        # image
        (axesX, axesY) = (int(w * 0.75) // 2, int(h * 0.75) // 2)
        ellipMask = np.zeros(image.shape[:2], dtype = "uint8")
        cv2.ellipse(ellipMask, (cX, cY), (axesX, axesY), 0, 0, 360, 255, -1)
        # loop over the segments
        for (startX, endX, startY, endY) in segments:
			# construct a mask for each corner of the image, subtracting
			# the elliptical center from it
            cornerMask = np.zeros(image.shape[:2], dtype = "uint8")
            cv2.rectangle(cornerMask, (startX, startY), (endX, endY), 255, -1)
            cornerMask = cv2.subtract(cornerMask, ellipMask)
			# extract a color histogram from the image, then update the
			# feature vector
            hist = self.histogram(image, cornerMask)
            features.extend(hist)
		# extract a color histogram from the elliptical region and
		# update the feature vector
        hist = self.histogram(image, ellipMask)
        features.extend(hist)
		# return the feature vector
        return features

    def histogram(self, image, mask):
		# extract a 3D color histogram from the masked region of the
		# image, using the supplied number of bins per channel
        hist = cv2.calcHist([image], [0, 1, 2], mask, self.bins,
			[0, 180, 0, 256, 0, 256])
		# normalize the histogram if we are using OpenCV 2.4
        if imutils.is_cv2():
            hist = cv2.normalize(hist).flatten()
		# otherwise handle for OpenCV 3+
        else:
            hist = cv2.normalize(hist, hist).flatten()
		# return the histogram
        return hist



# dataset = [
# 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOOxNxt24E-p3HEk-R0TmGDq7DjDIDiKpMwg&usqp=CAU',
# 'https://www.pngkey.com/png/full/300-3006212_more-views-lays-chips.png',
# 'https://www.loacker.com/mediaObject/importedProducts/ProdWeb-1860091_int-en_packaged/original/ProdWeb-1860091_int-en_packaged.png',
# 'https://www.loacker.com/mediaObject/importedProducts/ProdWeb-1860051_int-en_packaged/original/ProdWeb-1860051_int-en_packaged.png',
# 'https://innposotradingbv.com/wp-content/uploads/2019/08/7082810_digital-image_1024x1024.png',
# 'https://www.kitkat.co.uk/sites/default/files/2020-08/chunky-cookie-dough.png',
# 'https://i.pinimg.com/originals/3a/16/73/3a1673116bf8dddbe45bf22a705a614d.png',
# 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5iR2L4L2L2-Xhj4s81TJgcl21iTI09Cw9g&usqp=CAU',
# 'https://images.yaoota.com/qWCzFVfspZN_chNeVxtQ6xNYY1w=/trim/yaootaweb-production/media/crawledproductimages/eeb0ec7a7349ca263e2205f614552ba3a8f6746c.jpg',
# 'https://images-na.ssl-images-amazon.com/images/I/714A58g3xWS.jpg',
# 'https://assets.sainsburys-groceries.co.uk/gol/7541401/1/640x640.jpg'
# ]

dataset = json.loads(sys.argv[1])
inputImage = json.loads(sys.argv[2])

# inputImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaqIwPNMBRREe6YLMtw5_7MPHVk8YURXLDoX8q1rfBAxMAuTYiNnlK4iStMViEZZCWW4&usqp=CAU'

def getUrlImgMtx(url):
    # resp = urllib.request.urlopen(url)
    # image = np.asarray(bytearray(resp.read()), dtype="uint8")
    # newImage = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # return newImag

    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1)
    return img

def indexFunction(dataset): 
    
    cd = ColorDescriptor((8, 12, 3))
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
        # parse out the image ID and features, then compute the
        # chi-squared distance between the features in our index
        # and our query features
        feature = [float(x) for x in indexFeature["features"]] 
        d = chi2_distance(feature, queryFeature)
        # now that we have the distance between the two feature
        # vectors, we can udpate the results dictionary -- the
        # key is the current image ID in the index and the
        # value is the distance we just computed, representing
        # how 'similar' the image in the index is to our query
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
