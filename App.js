import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from "anonymous-files";
import logo from './assets/BTC.png';




export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [name,setName] = React.useState('Danny');
  const [acct_id,setAcct_id] = React.useState('0000000000000000')
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {

      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {

      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    }
    else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  };


  if (selectedImage !== null) {
    return (
        <View style = {styles.container} >
          <Image
            source={{uri: selectedImage.localUri}}
            style = {styles.thumbnail}
            />
        <TouchableOpacity onPress={() => alert('Psyche! Thats the wrong number')} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {() => setSelectedImage(null)}style ={styles.button}>

          <Text style = {styles.buttonText}>Nah</Text>

        </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style = {styles.logo}/>

      <Text style = {styles.instructions} > Welcome to the Porty! The simple and private cryptocurrency portfolio tracker.</Text>

      <TouchableOpacity
        onPress={() => alert('Psyche! Thats the wrong number')}
        style ={styles.button}>

        <Text style = {styles.buttonText}>Share photos for some reason</Text>

      </TouchableOpacity>


      <StatusBar style="auto" />
    </View>
  );
}

// <Image source={require('../assets/favicon.png')} />


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    logo:{
      width:200,
      height:200,
      marginBottom:10,
    },
    instructions: {
      color: '#888',
      fontSize:18,
      marginHorizontal: 15,
    },
    button:{
      backgroundColor: "grey",
        padding: 20,
        borderRadius: 5,
        marginTop: 15,
    },
    buttonText: {
      fontSize: 20,
        color: '#fff',
    },
    thumbnail: {
    width: 300,
      height: 300,
      resizeMode: 'contain'
    }
});
