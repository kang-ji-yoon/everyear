import tensorflow as tf
import numpy as np
import PIL.Image as im
import os
import pandas as pd
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def resize_Image(filenames,size):
    resize_img = []
    for filename in filenames:
        image = im.open(filename)
        reImg = image.resize(size)
        resize_img.append(np.array(reImg))
    resize_img =  np.array(resize_img)
    
    return resize_img

def Load_Image(filenames):
    images = []
    for filename in filenames:
        image = im.open(filename)
        images.append(np.array(image))
    images = np.array(images)

    return images

data = pd.read_csv("asdf/data.csv")

global_step = tf.Variable(0, trainable=False, name='global_step')

X = tf.placeholder(tf.float32, shape=[None, 224, 224, 3])
keep_prob = tf.placeholder(tf.float32)

data = "asdf/data/" + data["filename"]
x_data = Load_Image(data)
x_data = resize_Image(data, (224, 224))


# Layer 1
W1 = tf.Variable(tf.random_normal([3, 3, 3, 16], stddev=0.01))
b1 = tf.Variable(tf.zeros([16]))
L1 = tf.nn.conv2d(X, W1, strides=[1, 1, 1, 1], padding='SAME')
L1 = tf.nn.relu(L1 + b1)
L1 = tf.nn.max_pool(L1, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding ='SAME')

# Layer 2
W2 = tf.Variable(tf.random_normal([3, 3, 16, 32], stddev=0.01))
b2 = tf.Variable(tf.zeros([32]))
L2 = tf.nn.conv2d(L1, W2, strides=[1, 1, 1, 1], padding='SAME')
L2 = tf.nn.relu(L2 + b2)
L2 = tf.nn.max_pool(L2, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

W3 = tf.Variable(tf.random_normal([56 * 56 * 32, 1024], stddev=0.01))
b3 = tf.Variable(tf.zeros([1024]))
L3 = tf.reshape(L2, [-1, 56 * 56 *32])
L3 = tf.nn.relu(tf.matmul(L3, W3) + b3)
L3 = tf.nn.dropout(L3, 1.0)

W4 = tf.Variable(tf.random_normal([1024, 3]))
b4 = tf.Variable(tf.zeros([3]))
model = tf.matmul(L3, W4) + b4

sess = tf.Session()
saver = tf.train.Saver(tf.global_variables())
ckpt = tf.train.get_checkpoint_state('./model')

saver.restore(sess, ckpt.model_checkpoint_path)

ourmodel = sess.run(model, feed_dict={X: x_data, keep_prob: 1.0})
result = sess.run(tf.argmax(ourmodel, 1))

if result == 0:
    print('0') # 닭다리
elif result == 1:
    print("1") # 가나
elif result == 2:
    print("2") # 마이구미
else:
    print("none")
os.remove("asdf/data/img.jpg")