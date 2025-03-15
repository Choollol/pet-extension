export const petInfo = {
	testPet: {
		name: "Test Pet",
		idle_sprites: [
			browser.runtime.getURL("/pet_sprites/test_pet/idle/Test_Pet_Idle_1.png"),
			browser.runtime.getURL("/pet_sprites/test_pet/idle/Test_Pet_Idle_2.png"),
		],
		move_sprites: [
			browser.runtime.getURL("/pet_sprites/test_pet/move/Test_Pet_Move_1.png"),
			browser.runtime.getURL("/pet_sprites/test_pet/move/Test_Pet_Move_2.png"),
		],
}
};
