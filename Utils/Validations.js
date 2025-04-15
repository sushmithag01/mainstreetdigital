import HTML from 'react-native-render-html';
import {Text,  useWindowDimensions} from 'react-native';
import styles from '../Common.css';

export const FirstNameCheck = (event) => {
  let firstNameCheck = {};
  if (!event) {
    return (firstNameCheck = {
      input: "empty",
      err_display: "First Name is required!",
    });
  }
  return (firstNameCheck = {
    validition: true,
  });

}

export const LastNameCheck = (event) => {
  let LastNameCheck = {};
  if (!event) {
    return (LastNameCheck = {
      input: "empty",
      err_display: "Last Name is required!",
    });
  }
  return (lastNameCheck = {
    validition: true,
  });
}

export const MobileNumberCheck = (value) => {
  let mobileNumberCheck = {};
  const mobileCond = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!value) {
    return (mobileNumberCheck = {
      input: "empty",
      err_display: "Mobile number is required!",
    });
  } else if (mobileCond.test(value) === false) {
    return (mobileNumberCheck = {
      input: "invalid",
      err_display: "Enter a valid Mobile number!",
    });
  }
  return (mobileNumberCheck = {
    validition: true,
  });
};


export const EmailCheck = (value) => {
  let emailCheck = {};
  const emailCond =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!value) {
    return (emailCheck = {
      input: "empty",
      err_display: "Email is required!",
    });
  } else if (emailCond.test(value) === false) {
    return (emailCheck = {
      input: "invalid",
      err_display: "Enter a valid email address!",
    });
  }
  return (emailCheck = {
    validition: true,
  });
};


export const PasswordCheck = (value) => {
  let createPasswordCheck = {};
  // const passwordCond = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const passwordCond =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!value) {
    return (createPasswordCheck = {
      input: "empty",
      err_display: "Create a Password!",
    });
  } else if (value.length < 8) {
    return (createPasswordCheck = {
      input: "lesscharacters",
      err_display:
        "Should contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character!",
    });
  } else if (passwordCond.test(value) === false) {
    return (createPasswordCheck = {
      input: "invalid",
      err_display:
        "Should contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character!",
    });
  }
  return (createPasswordCheck = {
    validition: true,
  });
};

export const ConfirmPasswordCheck = (value1, value2) => {
  let confirmPasswordCheck = {};
  if (!value2) {
    return (confirmPasswordCheck = {
      input: "empty",
      err_display: "Confirm the Password!",
    });
  } else if (value1 != value2) {
    return (confirmPasswordCheck = {
      input: "deosnotmatch",
      err_display: "Password did not match!",
    });
  }
  return (confirmPasswordCheck = {
    validition: true,
  });
};

export const OtpCheck = (value) => {
  let otpCheck = {};
  if (!value) {
    return (otpCheck = {
      input: "empty",
      err_display: "Please Enter One-time verification code!",
    });
  } else if (value.length < 6) {
    return (otpCheck = {
      input: "LessCharacters",
      err_display: "Please enter all the 6 digits!",
    });
  }
  return (otpCheck = {
    validition: true,
    status: "Successful!",
  });
};

export const formatPhoneNumber = (value) => {
  let digits = value?.replace(/\D/g, "");
  digits = digits?.substring(0, 10);
  let formatted = digits;
  if (digits.length > 3) {
    formatted = digits.substring(0, 3) + "-" + digits.substring(3);
  }
  if (digits.length > 6) {
    formatted = formatted.substring(0, 7) + "-" + formatted.substring(7);
  }

  return formatted;
};

export const validatePhoneNumber = (value) => {
  let digits = value.replace(/\D/g, "");
  return digits.length === 10;
};


export const DateFormatter = (value) =>{
  
  const productDate = value ? new Date(value):new Date() ;
  const productDateFormatted =
    productDate.toLocaleString("en-US", { month: "short" }) +
    "-" +
    productDate.getDate() +
    "-" +
    productDate.getFullYear();
  return productDateFormatted;
}

export const getAddressString = (productDetail) => {
  if (typeof productDetail !== 'object' || productDetail === null) {
    return 'No data available';
  }
  const parts = [];
  if (productDetail.bup_address1) {
    parts.push(productDetail.bup_address1.replace(/,\s*$/, ''));
  }
  if (productDetail.bup_address2) {
    parts.push(productDetail.bup_address2.replace(/,\s*$/, ''));
  }
  if (productDetail.bup_city) {
    parts.push(productDetail.bup_city.replace(/,\s*$/, ''));
  }
  if (productDetail.bup_state) {
    parts.push(productDetail.bup_state.replace(/,\s*$/, ''));
  }
  if (productDetail.bup_country) {
    parts.push(productDetail.bup_country.replace(/,\s*$/, ''));
  }

  return parts.length > 0 ? parts.join(', ') : 'No data available';
};


  const containsHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);

  export const renderDescription = (Description) => {
    console.log(Description,"Description")
    const { width } = useWindowDimensions();
    if (containsHTML(Description)) {
      return (
        <HTML
        source={{ html: Description }}
        contentWidth={width}
          tagsStyles={{
            ol: styles.listAbout,
            li: styles.listItemAbout,
            a: styles.linkAbout,
            p: styles.paragraphAbout,
          }}
        />
      );
    } else {
      return (
        <Text style={styles.cardtext3}>
          {Description || ''}
        </Text>
      );
    }
  };