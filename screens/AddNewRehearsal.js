import { Button, Text } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import { Avatar } from "react-native-paper";
import CustomClickableIcon from "../components/CustomClickableIcon";
import CustomInput from "../components/CustomInput";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { RehearsalContext } from "../context/RehearsalContext";
import { UserContext } from "../context/UserContext";
import { getKeyName } from "../model/SongKeys";
import { getUserBandRoleName } from "../model/UserBandRoles";
import { initialRehearsalState } from "../context/RehearsalContext";
import { saveNewRehearsal } from "../db/fb-store";
import { useForm } from "react-hook-form";

export default function AddNewRehearsal ({ navigation, route}){

  const userContext = useContext(UserContext);
  const rehearsalContext = useContext(RehearsalContext);
  const [rehearsalDate, setRehearsalDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(true)
  const [locationName, setLocationName] = useState("Please select the Location");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setRehearsalDate(currentDate);
  };

  useEffect(() => {
    if(rehearsalContext.rehearsal.location.addressName) {
      setLocationName(rehearsalContext.rehearsal.location.addressName);
    } else {
      setLocationName("Please select the Location");
    }
  }, [rehearsalContext.rehearsal.location])
  
  useEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => (
        <CustomClickableIcon
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            size={24}
            style={{ color: "#0041C3" , marginRight: 10 }}
        />
      ),
    });
  });
  


  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();


  const onSubmit = (data) => {
    const rehearsal = {
      name: data.name,
      rehearsalDate: rehearsalDate.getTime(),
      members: rehearsalContext.rehearsal.members,
      songs: rehearsalContext.rehearsal.songs,
      location: rehearsalContext.rehearsal.location
    }
    saveNewRehearsal(rehearsal, userContext.user.bandCode, (responseMessage) => {
        alert(responseMessage);
        rehearsalContext.setRehearsalState(initialRehearsalState);
        navigation.navigate("RehearsalsList");
    });
  };

  const renderItems = ({ index, item }) => {
    return (
      <Text variant="titleMedium">{item.name}</Text>
    );
};

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.formEntry}>
              <CustomInput
                  name="name"
                  placeholder="Enter the rehearsal name"
                  control={control}
                  rules={{required: 'The rehearsal name is required'}}
              />
          </View>
          <View style={[styles.formEntryDate]}>
              {showDatePicker && (
                  <View style = {styles.datetime}>
                  <RNDateTimePicker
                      testID="dateTimePicker"
                      value={rehearsalDate}
                      mode="date"
                      is24Hour={true}
                      onChange={onChange}
                  />
                  <RNDateTimePicker
                      testID="dateTimePicker"
                      value={rehearsalDate}
                      mode="time"
                      is24Hour={true}
                      onChange={onChange}
                  />
                  </View>
              )}
              <View style = {styles.formEntry}>
                  <Text>Date selected: {rehearsalDate.toLocaleString()}</Text>
              </View>
          </View>
          <View style={[styles.formEntry, {flexDirection: "row" , alignItems: 'center', marginRight: 65, justifyContent:'space-between'}]}>
              <Text variant="titleMedium">Select Members</Text>
              <CustomClickableIcon
                  icon="add"
                  onPress={() => navigation.navigate("PickMembers")}
                  size={24}
                  style={{ color: "#0041C3" , marginRight: 10 }}
              />
          </View>
          <View style = {{flexDirection: "column", alignContent: 'center', alignItems: 'center'}}>
            {rehearsalContext.rehearsal.members.map((item)=> <Text variant="titleMedium" key={item.id}>{item.name + " - " + getUserBandRoleName(item.userBandRole)}</Text>)}
          </View>
          <View style={[styles.formEntry, {flexDirection: "row" , alignItems: 'center', marginRight: 65, justifyContent:'space-between'}]}>
              <Text variant="titleMedium">Select Songs</Text>
              <CustomClickableIcon
                  icon="add"
                  onPress={() => navigation.navigate("PickSongs")}
                  size={24}
                  style={{ color: "#0041C3" , marginRight: 10 }}
              />
          </View>
          <View style = {{flexDirection: "column", alignContent: 'center', alignItems: 'center'}}>
            {rehearsalContext.rehearsal.songs.map((item)=> <Text variant="titleMedium" key={item.id}>{item.name + " - " + getKeyName(item.key)}</Text>)}
          </View>
          <View style={[styles.formEntry, {flexDirection: "row" , alignItems: 'center', marginRight: 65, justifyContent:'space-between'}]}>
            <Avatar.Image size={35} source={require('../assets/drum-set.png')} />
            <Text variant="titleMedium">{locationName}</Text>
            <CustomClickableIcon
              icon="location"
              onPress={() => navigation.navigate("Location")}
              size={24}
              style={{ color: "#8b0000" , marginRight: 10 }}
            />
          </View>
          <Button
            onPress={handleSubmit(onSubmit)}
            mode="elevated"
            style={styles.button}
          >
            Save
          </Button>
        </View>
      </View>
    </ScrollView>
  );


}

const styles = StyleSheet.create({
    button: {
      margin: 8,
      zIndex: 0
    },
    formEntry: {
      margin: 8,
    },
    formEntryDate:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    datetime:{
        flexDirection: 'row',
    },
    comboFormEntry: {
      zIndex: 1000
    },
    container: {
      flex: 1,
    },
    progressBar: {
      marginBottom: 16,
      paddingHorizontal: 0,
    },
  });