export async function validatePermission(permission_object) {
	try {
		return browser.permissions.contains(permission_object);
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function requestPermission(permission_object) {
	try {
		return browser.permissions.request(permission_object);
	} catch (error) {
		console.log(error);
		return false;
	}
}
