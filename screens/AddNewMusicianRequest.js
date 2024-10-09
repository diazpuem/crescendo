import { ScrollView, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import { Button } from "react-native-paper";
import CustomClickableIcon from "../components/CustomClickableIcon";
import CustomDropdownPicker from "../components/CustomDropdownPicker";
import CustomInput from "../components/CustomInput";
import { RehearsalContext } from "../context/RehearsalContext";
import { UserBandRoles } from "../model/UserBandRoles";
import { UserContext } from "../context/UserContext";
import { musicianRequestState } from "../model/MusicianRequestState"
import { saveNewMusicianRequest } from "../db/fs-store";
import { setupRehearsalsListener } from "../db/fs-store";
import { useForm } from "react-hook-form";

export default function AddNewMusicianRequest ({ navigation, route}){

    const userContext = useContext(UserContext);
    const rehearsalContext = useContext(RehearsalContext);
    const [rehearsals, setRehearsals] = useState([])
    const [openRehearsalsPicker, setOpenRehearsalsPicker] = useState(false);
    const [openBandRolePicker, setOpenBandRolePicker] = useState(false);

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

    useEffect(() => {
        setupRehearsalsListener(userContext.user.bandCode, (items) => {
            setRehearsals(formatRehearsalsToCombo(items));
        });
    }, []);
    
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();


    const onSubmit = (data) => {
        const musicianRequest = {
            bandCode: userContext.user.bandCode,
            bandName: userContext.user.bandName,
            rehearsalId: data.rehearsalId,
            bandRole: data.bandRole,
            description: data.description,
            date: new Date().getTime(),
            state: musicianRequestState.OPEN.id
        };
        saveNewMusicianRequest(musicianRequest, (responseMessage) => {
            alert("Created Musician request with code ", responseMessage);
            navigation.navigate("MusicianRequestScreen");
        });
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 16 }}>
                <View style={[styles.formEntry, styles.comboFormEntryRehearsal]}>
                    <CustomDropdownPicker 
                        control = {control}
                        name = "rehearsalId"
                        rules={{required: 'Rehearsal is required'}}
                        placeholder="Please choose the rehearsal"
                        open = {openRehearsalsPicker}
                        setOpen = {setOpenRehearsalsPicker}
                        items = {rehearsals}
                    />
                </View>
                <View style={[styles.formEntry, styles.comboFormEntryMusicianType]}>
                    <CustomDropdownPicker 
                        control = {control}
                        name = "bandRole"
                        rules={{required: 'The type of musician is required'}}
                        placeholder="Which musician do you need?"
                        open = {openBandRolePicker}
                        setOpen = {setOpenBandRolePicker}
                        items = {UserBandRoles}
                    />
                </View>
                <View style={styles.formEntry}>
                    <CustomInput
                        name="description"
                        placeholder="Enter the rehearsal name"
                        control={control}
                        rules={{required: 'The Description is required'}}
                        multiline={true}
                    />
                    </View>
                <Button
                    onPress={handleSubmit(onSubmit)}
                    mode="elevated"
                    style={styles.button}
                >
                    Send Request
                </Button>
            </View>
        </View>
        </ScrollView>
    );
}

function formatRehearsalsToCombo(rehearsals) {
    return rehearsals.sort(
        function (a, b) {
            dateA = new Date(a.rehearsalDate);
            dateB = new Date(b.rehearsalDate);
            return dateA.getTime() - dateB.getTime()
        }
    ).map( rehearsal => {
        return {
            "value": rehearsal.id,
            "label": rehearsal.name + " " + new Date(rehearsal.rehearsalDate).toLocaleDateString('en-US'),
        };
    });
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
    comboFormEntryRehearsal: {
        zIndex: 2000
    },
    comboFormEntryMusicianType: {
        zIndex: 1000
    },
    container: {
        flex: 1,
    },
    progressBar: {
        marginBottom: 16,
        paddingHorizontal: 0,
    }
});