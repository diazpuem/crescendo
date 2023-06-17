import { Button, MD3Colors, ProgressBar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import CustomDropdownPicker from "../components/CustomDropdownPicker";
import CustomInput from "../components/CustomInput";
import { UserContext } from "../context/UserContext";
import { UserRoles } from "../model/UserRoles";
import { useForm } from "react-hook-form";
import { useIsFocused } from "@react-navigation/native";

export default function Step1Screen ({ navigation }){
// keep back arrow from showing
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const userContext = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [userRolesValues, setUserRolesValues] = useState(UserRoles);
  
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: userContext.user  });

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && userContext.setUserState({progress: 0});
  }, [isFocused]);

  const onSubmit = (data) => {
    userContext.setUserState({ name: data.name, userRole: data.userRole });
    console.log(userContext.user);
    if (data.userRole == 1){
        navigation.navigate("Step 2a");
    } else {
        navigation.navigate("Step 2b");
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={userContext.user.progress}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.formEntry}>
            <CustomInput
                name="name"
                placeholder="Enter Full Name"
                control={control}
                rules={{required: 'Name is required'}}
            />
        </View>
        <View style={[styles.formEntry]}>
            <CustomDropdownPicker 
                control={control}
                name="userRole"
                rules={{required: 'User Role is required'}}
                placeholder="Please choose type"
                open = {open}
                setOpen= {setOpen}
                items = {userRolesValues}
            />
        </View>
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