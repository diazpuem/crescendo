import { Button, MD3Colors, ProgressBar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import CustomDropdownPicker from "../components/CustomDropdownPicker";
import CustomInput from "../components/CustomInput";
import { UserBandRoles } from "../model/UserBandRoles";
import { UserContext } from "../context/UserContext";
import { getBandName } from "../db/fb-store";
import { useForm } from "react-hook-form";
import { useIsFocused } from "@react-navigation/native";

export default function Step2bScreen ({ navigation }){
// keep back arrow from showing
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const userContext = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [userBandRolesValues, setUserBandRolesValues] = useState(UserBandRoles);
  
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: userContext.user  });

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && userContext.setUserState({progress: 50});
  }, [isFocused]);

  const onSubmit = (data) => {
    getBandName(data.bandCode, (bandName) => {
      if (bandName != null) {
        userContext.setUserState({ bandCode: data.bandCode ,bandName: bandName, userBandRole: data.userBandRole});
        navigation.navigate("Confirmation", { lastScreen: "Step 2b" });
      } else {
        alert("This band code does not exists");
      }
    });
  };

  const onBack = () => {
    navigation.navigate("Step 1");
  };


  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={userContext.user.progress / 100}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.formEntry}>
            <CustomInput
                name="bandCode"
                placeholder="Please fill the band code"
                control={control}
                rules={{required: 'The band code is required'}}
            />
        </View>
        <View style={[styles.formEntry]}>
            <CustomDropdownPicker 
                control={control}
                name="userBandRole"
                rules={{required: 'Your band role is required'}}
                placeholder="Please choose your band role"
                open = {open}
                setOpen= {setOpen}
                items = {userBandRolesValues}
            />
        </View>
        <Button
          onPress={(onBack)}
          mode="elevated"
          style={styles.button}
        >
          Back
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          mode="elevated"
          style={styles.button}
        >
          Next Step
        </Button>
      </View>
    </View>
  );


}

const styles = StyleSheet.create({
    button: {
      margin: 8,
      zIndex: 0
    },
    formEntry: {
      margin: 8,
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